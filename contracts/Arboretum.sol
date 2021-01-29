/*
   File - Arboretum.sol
   This is a simple, monolithic smart-contract factory
   It divides the game logic into 3 steps - plant(), water(), redeem()
   It performs time-managment functions and reverts on invalid moves.

   Author: Michael C
*/

//TO-DO: Testing
//TO-DO: Mint NFT for planters if they "win"

pragma solidity ^0.7.4;

library SafeMath {
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
    
    uint constant WAD = 10 ** 18; 
    uint constant RAY = 10 ** 27;

    function wmul(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, y), WAD / 2) / WAD;
    }
    function rmul(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, y), RAY / 2) / RAY;
    }
    function wdiv(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, WAD), y / 2) / y;
    }
    function rdiv(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, RAY), y / 2) / y;
    }
}

struct Tree {
    uint bountyPool;       //Size of the bounty (in wei)
    uint treeDuration;     //How long the tree runs in seconds (timestamp)
    uint paymentFrequency; //Number of payments to be made
    uint paymentSize;      //Payment amount in ether (wei)
    uint lapseLimit;
    uint fee; //--NEW: Fee 
    uint startDate;        //Time before watering period starts (in seconds)
    uint waterersNeeded;   //Minimum players needed to join
    
    address payable planter;       //Address of tree planter / owner
    address[] waterers;    //Array of all tree waterers
    
    //--bookkeeping--//
    uint fundsRaised;
    uint aTokensRaised; //Once converted to aTokens
    uint finishedCount; //--NEW: count of all players that made 'paymentFrequency' payments (finished watering)
   
}

struct UserStats {
    uint fruitEarned; 
    uint nextDue; //Time until next payment must be made (in seconds)
    uint lastDue; //--NEW: Player must wait until next interval before watering again (prevents watering back-to-back)
}

contract Arboretum {
    
    using SafeMath for uint; //(Enable safe arithmetic - NEW)
    
    uint public treeCount;
    mapping (uint => Tree) public trees;
    
    //User stats:
    mapping (uint => mapping (address => UserStats)) public statsForTree;
    
    function plant(uint duration, uint freq, uint payment_size, uint lapse_limit, uint fee_amount ,uint start_date, uint min_waterers) public payable {
        require (start_date > block.timestamp, "Trees can only grow in the future.");
        
        Tree memory t;
        
        t.bountyPool = msg.value;
        t.treeDuration = duration;
        t.paymentFrequency = freq;
        t.paymentSize = payment_size;
        t.lapseLimit = lapse_limit;
        t.fee = fee_amount;
        t.startDate = start_date;
        t.planter = msg.sender; 
        t.waterersNeeded = min_waterers;
        
        //Validation and processing payment (bugfix - update fundsRaised before storing struct):
        t.fundsRaised = t.fundsRaised.add(t.bountyPool);
        
        trees[treeCount] = t;
        treeCount++;
        
        emit TreePlanted(treeCount - 1);
    }
    
    function water(uint id) public payable {
        require (id < treeCount);
        
        Tree memory t = trees[id];
        UserStats memory stats = statsForTree[id][msg.sender];
        
        require (t.planter != msg.sender, "Can't water own tree.");
        require (block.timestamp <= (t.startDate.add(t.treeDuration)), "Watering period has ended.");
        
        //if we are waiting for waterers to join:
        //(right now it is free to join an upcoming tree)
        if (block.timestamp < t.startDate) {
            require(stats.nextDue == 0, "Can only join the tree once"); //Only new players have a 0 next-due (Bugfix - makes sure you can only join once)
            require(msg.value == 0); //BUGFIX: make sure we don't keep ether for joining
            
            trees[id].waterers.push(msg.sender);
            
            //Give the user stats per each tree they are a member
            stats.fruitEarned = 0;
            stats.nextDue = t.startDate.add(t.treeDuration.div(t.paymentFrequency));
            
            statsForTree[id][msg.sender] = stats;
            emit JoinTree(id, msg.sender);
            return;
        }
        
        //if we are past the start date, before end date and min waterers is met: 
        //bugfix: remove redundant end check
        if (block.timestamp >= t.startDate && t.waterers.length >= t.waterersNeeded) {
             stats = statsForTree[id][msg.sender];
            
            require (msg.value == t.paymentSize, "Incorrect payment amount."); //make sure waterer is sending the right payment
            require (block.timestamp <= stats.nextDue && stats.nextDue > 0, "You lapsed. No fruit for you!"); //make sure payment is happening before the due period, and user pre-joined by watering
            require (block.timestamp >= stats.lastDue, "Wait until the next payment cycle.");
            
            trees[id].fundsRaised = trees[id].fundsRaised.add(msg.value);
            statsForTree[id][msg.sender].fruitEarned += 1;
            statsForTree[id][msg.sender].lastDue = stats.nextDue;
            statsForTree[id][msg.sender].nextDue = stats.nextDue.add(t.treeDuration.div(t.paymentFrequency));
            
            if (statsForTree[id][msg.sender].fruitEarned == trees[id].paymentFrequency) { //--NEW: Keeps track of count of all players who met their payments 
               trees[id].finishedCount++; 
            }
            
            emit TreeWatered(id, msg.sender);
        } else {
            revert("Not enough waterers. Bye Felicia."); //log and disallow watering if not enough joined
        }
    }
    
    //--NEW: Fruit paramater dropped, redeem is now all-or-nothing and based on role.

    function redeem(uint id) public {
        require(id < treeCount);
        require (block.timestamp > trees[id].startDate.add(trees[id].treeDuration), "Must wait until watering period is over to redeem."); //bugfix: start date must be added to duration
        //require (fruit <= statsForTree[id][msg.sender].fruitEarned && fruit > 0);
        
       if (msg.sender == trees[id].planter) {
          if (trees[id].waterers.length < trees[id].waterersNeeded) {
             require(msg.sender == trees[id].planter, "Must be planter to redeem bounty.");
             require(trees[id].bountyPool > 0, "Bounty already returned to planter or no bounty");
            
             uint bounty = trees[id].bountyPool; 
             trees[id].bountyPool = 0; 
             trees[id].fundsRaised = 0; 
            
             emit FruitRedeemed(id, msg.sender, bounty);
             msg.sender.transfer(bounty);
            
             return; 
          }

          //Send the bounty+fee if lapse limit hit:
          if (trees[id].lapseLimit < lapsePercent(id)) {
              uint bounty = trees[id].bountyPool;
              uint fee = feeAmount(id);
              trees[id].bountyPool = 0;
              trees[id].fee = 0;
              trees[id].fundsRaised = trees[id].fundsRaised.sub(bounty);
              emit FruitRedeemed(id, msg.sender, bounty.add(fee));
              trees[id].planter.transfer(bounty.add(fee));
          }
          
       } else {
          if (statsForTree[id][msg.sender].fruitEarned == trees[id].paymentFrequency) {
            
               uint amountToSend = 0;
               if (trees[id].lapseLimit > lapsePercent(id)) {
                
                    amountToSend = trees[id].fundsRaised.div(trees[id].finishedCount);
                    statsForTree[id][msg.sender].fruitEarned = 0;
                    emit FruitRedeemed(id, msg.sender, amountToSend);
                    msg.sender.transfer(amountToSend);
            
                } else {
                   
                   uint bounty = trees[id].bountyPool;
                   uint fee = feeAmount(0);
                   uint payments = trees[id].fundsRaised.sub(bounty).sub(fee);
                   amountToSend = payments.div(trees[id].finishedCount);
                   emit FruitRedeemed(id, msg.sender, amountToSend);
                   msg.sender.transfer(amountToSend);
             }       
          }
       }
        
    }
    
    //--NEW: returns 0 if not started yet
    function getTimeLeft(uint id) view public returns (uint) {
          require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree memory t = trees[id];
          
          return (time > t.startDate+t.treeDuration || time < t.startDate) ? 0 : (t.startDate.add(t.treeDuration)).sub(time); 
          
    }
    
    //--NEW: Like getTimeLeft, but a countdown until the watering period starts
    function getTimeLeftToStart(uint id) view public returns (uint) {
        require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree memory t = trees[id];
          
          return (time > t.startDate) ? 0 : t.startDate.sub(time); 
    }
      
    //Returns the percent of waterers that lapsed  
    function lapsePercent(uint id) view public returns(uint) {
        require(id < treeCount);
        
        Tree memory t = trees[id];
        
        return 100 - ((t.finishedCount.mul(100)).div(t.waterers.length));
    }
    
    //Returns how much the Planter would earn in fees if lapse limit was hit:
    function feeAmount(uint id) view public returns (uint) {
        require(id < treeCount);
        
        Tree memory t = trees[id];
        
        return t.fundsRaised.sub(t.bountyPool).wmul(t.fee);
    }
    
    event JoinTree(uint _id, address _waterer);
    event TreeWatered(uint _id, address _waterer);
    event TreePlanted(uint _id);
    event FruitRedeemed(uint _id, address _redeemer, uint _etherAmount);
}

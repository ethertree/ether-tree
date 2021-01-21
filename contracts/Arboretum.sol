/*
   File - Arboretum.sol
   This is a simple, monolithic smart-contract factory
   It divides the game logic into 3 steps - plant(), water(), redeem()
   It performs time-managment functions and reverts on invalid moves.
*/

//TO-DO: Testing. Update - tested some fail scenarios and 1 win scenario via VM. Will test on testnet next.
//TO-DO: Use DSMath or SafeMath for formulae
//TO-DO: Lapse rate logic (incl. returning bounty to planter)
//TO-DO: Fee logic
//TO-DO: Mint NFT for planters if they "win"
//TO-DO: Connect to aave to earn interest for the pool (?)
//TO-DO: Design meeting with dev team (should each tree be it's own seperate smart-contract?)
//TO-DO: More comments and doc-style comments

pragma solidity ^0.7.4;

struct Tree {
    uint bountyPool;
    uint treeDuration;
    uint paymentFrequency;
    uint paymentSize;
    uint lapseLimit;
    uint startDate;
    uint waterersNeeded;
    
    address planter;
    address[] waterers;
    
    //--bookkeeping--//
    uint fundsRaised;
    uint finishedCount; //--NEW: count of all players that made 'paymentFrequency' payments (finished watering)
   
}

struct UserStats {
    uint fruitEarned; 
    uint nextDue;
}

contract Arboretum {
    uint public treeCount;
    mapping (uint => Tree) public trees;
    
    //User stats:
    mapping (uint => mapping (address => UserStats)) public statsForTree;
    
    function plant(uint duration, uint freq, uint payment_size, uint lapse_limit, uint start_date, uint min_waterers) public payable {
        require (start_date > block.timestamp, "Trees can only grow in the future.");
        
        Tree memory t;
        
        t.bountyPool = msg.value;
        t.treeDuration = duration;
        t.paymentFrequency = freq;
        t.paymentSize = payment_size;
        t.lapseLimit = lapse_limit;
        t.startDate = start_date;
        t.planter = msg.sender; 
        t.waterersNeeded = min_waterers;
        
        //Validation and processing payment (bugfix - update fundsRaised before storing struct):
        t.fundsRaised += t.bountyPool;
        
        trees[treeCount] = t;
        treeCount++;
        
        emit TreePlanted(treeCount - 1);
    }
    
    function water(uint id) public payable {
        require (id < treeCount);
        
        Tree memory t = trees[id];
         UserStats memory stats = statsForTree[id][msg.sender];
        
        require (t.planter != msg.sender, "Can't water own tree.");
        require (block.timestamp <= (t.startDate+(t.treeDuration)), "Watering period has ended.");
        
        //if we are waiting for waterers to join:
        //(right now it is free to join an upcoming tree)
        if (block.timestamp < t.startDate) {
            require(stats.nextDue == 0, "Can only join the tree once"); //Only new players have a 0 next-due (Bugfix - makes sure you can only join once)
            trees[id].waterers.push(msg.sender);
            
            //Give the user stats per each tree they are a member
            stats.fruitEarned = 0;
            stats.nextDue = t.startDate + (t.treeDuration / t.paymentFrequency);
            
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
            
            trees[id].fundsRaised += msg.value;
            statsForTree[id][msg.sender].fruitEarned += 1;
            statsForTree[id][msg.sender].nextDue = stats.nextDue + (t.treeDuration / t.paymentFrequency);
            
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
        require (block.timestamp > trees[id].treeDuration, "Must wait until watering period is over to redeem.");
        //require (fruit <= statsForTree[id][msg.sender].fruitEarned && fruit > 0);
        
        //--NEW: If the minimum waterers wasn't met by start time, return bounty to the planter. 
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
        
        //--NEW: Logic changed to split between everyone who made paymentFrequency payments.
        if (statsForTree[id][msg.sender].fruitEarned == trees[id].paymentFrequency) {
            
            uint amountToSend = trees[id].fundsRaised / trees[id].finishedCount ;
            statsForTree[id][msg.sender].fruitEarned = 0;
            emit FruitRedeemed(id, msg.sender, amountToSend);
            msg.sender.transfer(amountToSend);
        }
        
    }
    
    //--NEW: returns 0 if not started yet
    function getTimeLeft(uint id) view public returns (uint) {
          require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree memory t = trees[id];
          
          return (time > t.startDate+t.treeDuration || time < t.startDate) ? 0 : (t.startDate+t.treeDuration) - time; 
          
    }
    
    //--NEW: Like getTimeLeft, but a countdown until the watering period starts
    function getTimeLeftToStart(uint id) view public returns (uint) {
        require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree memory t = trees[id];
          
          return (time > t.startDate) ? 0 : t.startDate - time; 
    }
      
    function maximumFruit(uint id) view public returns (uint) {
        
        return trees[id].waterers.length*trees[id].paymentFrequency;
          
    }
    
    event JoinTree(uint _id, address _waterer);
    event TreeWatered(uint _id, address _waterer);
    event TreePlanted(uint _id);
    event FruitRedeemed(uint _id, address _redeemer, uint _etherAmount);
}

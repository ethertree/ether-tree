/*
   File - Arboretum.sol
   This is a simple, monolithic smart-contract factory
   It divides the game logic into 3 steps - plant(), water(), redeem()
   It performs time-managment functions and reverts on invalid moves.
*/

//TO-DO: Testing
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
        require (start_date > block.timestamp);
        
        Tree memory t;
        
        t.bountyPool = msg.value;
        t.treeDuration = duration;
        t.paymentFrequency = freq;
        t.paymentSize = payment_size;
        t.lapseLimit = lapse_limit;
        t.startDate = start_date;
        t.planter = msg.sender; 
        t.waterersNeeded = min_waterers;
        
        trees[treeCount] = t;
        treeCount++;
        
        //Validation and processing payment:
        t.fundsRaised += t.bountyPool;
        
        emit TreePlanted(treeCount - 1);
    }
    
    function water(uint id) public payable {
        require (id < treeCount);
        
        Tree memory t = trees[id];
         UserStats memory stats;
        
        require (t.planter != msg.sender);
        require (block.timestamp <= (t.startDate+(t.treeDuration)));
        
        //if we are waiting for waterers to join:
        //(right now it is free to join an upcoming tree)
        if (block.timestamp < t.startDate) {
            trees[id].waterers.push(msg.sender);
            
            //Give the user stats per each tree they are a member
            stats.fruitEarned = 0;
            stats.nextDue = t.startDate + (t.treeDuration / t.paymentFrequency);
            
            statsForTree[id][msg.sender] = stats;
            emit JoinTree(id, msg.sender);
            return;
        }
        
        //if we are past the start date, before end date and min waterers is met: 
        if (block.timestamp >= t.startDate && block.timestamp <= t.treeDuration && t.waterers.length >= t.waterersNeeded) {
             stats = statsForTree[id][msg.sender];
            
            require (msg.value == t.paymentSize); //make sure waterer is sending the right payment
            require (block.timestamp <= stats.nextDue && stats.nextDue > 0); //make sure payment is happening before the due period, and user pre-joined by watering
            
            trees[id].fundsRaised += msg.value;
            statsForTree[id][msg.sender].fruitEarned += 1;
            statsForTree[id][msg.sender].nextDue = stats.nextDue + (t.treeDuration / t.paymentFrequency);
            
            emit TreeWatered(id, msg.sender);
        }
    }
    
    function redeem(uint id, uint fruit) public {
        require(id < treeCount);
        require (block.timestamp > trees[id].treeDuration);
        require (fruit <= statsForTree[id][msg.sender].fruitEarned && fruit > 0);
        
        uint amountToSend = trees[id].fundsRaised / (fruit/maximumFruit(id));
        statsForTree[id][msg.sender].fruitEarned -= fruit;
        
        emit FruitRedeemed(id, msg.sender, amountToSend);
        msg.sender.transfer(amountToSend);
        
    }
    
    function getTimeLeft(uint id) view public returns (uint) {
          require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree memory t = trees[id];
          
          return (time > t.startDate+t.treeDuration) ? 0 : (t.startDate+t.treeDuration) - time; 
          
    }
      
    function maximumFruit(uint id) view public returns (uint) {
        
        return trees[id].waterers.length*trees[id].paymentFrequency;
          
    }
    
    event JoinTree(uint _id, address _waterer);
    event TreeWatered(uint _id, address _waterer);
    event TreePlanted(uint _id);
    event FruitRedeemed(uint _id, address _redeemer, uint _etherAmount);
}

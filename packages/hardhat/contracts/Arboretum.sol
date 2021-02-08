/*
   File - Arboretum.sol
   This is a simple, monolithic smart-contract factory
   It divides the game logic into 3 steps - plant(), water(), redeem()
   It performs time-managment functions and reverts on invalid moves.

*/

//TO-DO: Mint NFT for planters if they "win"
pragma solidity >=0.6.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

struct UserStats {
    uint fruitEarned; 
    uint nextDue; //Time until next payment must be made (in seconds)
    uint lastDue; //Player must wait until next interval before watering again (prevents watering back-to-back)
}

struct TreeInfo {
    uint id;
    uint bountyPool;       //Size of the bounty (in wei)
    uint treeDuration;     //How long the tree runs in seconds (timestamp)
    uint paymentFrequency; //Number of payments to be made
    uint paymentSize;      //Payment amount in ether (wei)
    uint lapseLimit;
    uint fee; //Fee 
    uint startDate;        //Time before watering period starts (in seconds)
    uint waterersNeeded;   //Minimum players needed to join
    uint planted; //Timestamp of when tree was planted 
    
    address payable planter;       //Address of tree planter / owner
    //address[] waterers;    //Array of all tree waterers
    uint waterersCount;
    
    //--bookkeeping--//
    uint fundsRaised;
    uint finishedCount; //count of all players that made 'paymentFrequency' payments (finished watering)
   
}

//Some handy global variables and addresses for AAVE
contract CoreType {
    address wethGateway = 0xf8aC10E65F2073460aAD5f28E1EABE807DC287CF;
    uint256 constant public MAX_UINT = 2**256 - 1;
}

//AAVE Lending Pool (WETH Gateway version)
interface IWETHGateway {
    function depositETH(address onBehalfOf, uint16 referralCode) external payable;
    function withdrawETH(uint256 amount, address to) external payable; 
    
    function getWETHAddress() external returns (address);
    function getAWETHAddress() external returns (address);

}

interface IERC20 { 
    
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
    
}


/// @title Arboretum
/// @author Michael C.
/// @notice The core entry point to ether tree. You can plant new trees, or join trees already planted
/// @dev The three main functions are plant(), water(), and redeem(). plant() creates a subcontract for each Tree
contract Arboretum is ERC721 {
    
    uint public treeCount;
    uint public nftCount; //NEW: Count (id) of all minted NFTs.

    mapping (uint => Tree) public trees;
    mapping (address => bool) public isTree; 
    mapping (address => uint[]) public _treesJoined; 

    constructor() public ERC721("EtherTree NFT", "ETR") {

    }
    
    
    /** 
     * @notice Plant a new tree. The planter chooses parameters that waterers must adhere to
     * @param duration - how long a tree will be in the watering phase, where payments can be made
     * @param freq - the number of payments players would have to make to earn a share of this Tree
     * @param payment_size - the size of the payment to be made each time. Format: wei
     * @param lapse_limit - exceeding this percent of delinquent payments will cause planter to earn their posted bounty back plus fee. Format:0-100
     * @param fee_amount - percentage planter gains if lapse_limit is breached. Format: WAD/wei (eg. 0.01 -> 10000000000000000)
     * @param start_date - Time before watering period starts, in which planter can join a tree. Format: unix timestamp
     * @param min_waterers - How many waterers must join for the watreing period to begin, else Fertilzer (payments) go to planter
     * 
    */
    function plant(uint duration, uint freq, uint payment_size, uint lapse_limit, uint fee_amount ,uint start_date, uint min_waterers) public payable {
        require (start_date > block.timestamp, "Trees can only grow in the future.");
        
        Tree t = (new Tree){value: msg.value}(treeCount,duration,freq,payment_size,lapse_limit, fee_amount ,start_date, min_waterers,msg.sender); 
       
        isTree[address(t)] = true;        
        trees[treeCount] = t;
        treeCount++;
        
        emit TreePlanted(treeCount - 1, start_date, start_date.add(duration), msg.value, fee_amount, payment_size, freq, lapse_limit, min_waterers); //expanded event (for subgraph)
    }
    
    /** 
     * @notice Before start_date, used to signify interest in joining, afterwards payments are accepted to water the tree
     * @param id - the id of tree to join or be watererd. 
     * @dev msg.value must be 0 for join, and exactly paymentSize when watering
    */
    function water(uint id) public payable {
      require (id < treeCount);
      
       Tree t = trees[id];
       
        require (t.planter() != msg.sender, "Can't water own tree.");
        require (block.timestamp <= (t.startDate().add(t.treeDuration())), "Watering period has ended.");
        
        t.water{value: msg.value}(msg.sender);
    }
    
    /** 
     * @notice Reedem fruit. This allows you to claim your share of earnings from the tree.
     * @param id - the id of the tree to redeem from. Tree watering period must be over to redeem.
    */
    function redeem(uint id) public {
        require(id < treeCount);
        require (block.timestamp > trees[id].startDate().add(trees[id].treeDuration()), "Must wait until watering period is over to redeem.");
        
        Tree t = trees[id];

        t.redeem(msg.sender);
    }
  
    /** 
     * @notice get UserStats struct, which shows user's progress with payments and due dates
     * @param id - the id of the tree to query
     * @param user - the user to fetch the details for
     * 
     * @return fruitEarned - number of payments the user made
     * @return nextDue - time until user must make payment unless they will be considered lapsed
     * @return lastDue - time user must wait until they can water again
    */
    function statsForTree(uint id, address user) view public returns (uint, uint, uint) {
         require(id < treeCount);
         
         Tree  t = trees[id];
         
         return t.statsForTree(user);
    }
    
    /** 
     * @notice Returns time left for the trees watering period in seconds
     */
    function getTimeLeft(uint id) view public returns (uint) {
          require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree  t = trees[id];
          
          return (time > t.startDate()+t.treeDuration() || time < t.startDate()) ? 0 : (t.startDate().add(t.treeDuration())).sub(time); 
          
    }
    
    /** 
     * @notice Returns time left to join a tree in seconds
     */
    function getTimeLeftToStart(uint id) view public returns (uint) {
        require(id < treeCount);
          uint256 time = block.timestamp; 
          
          Tree t = trees[id];
          
          return (time > t.startDate()) ? 0 : t.startDate().sub(time); 
    }
      
    
    /** 
     * @notice Returns percentage of users that lapsed. Units 0-100
     */ 
    function lapsePercent(uint id) view public returns(uint) {
        require(id < treeCount);
        
        Tree t = trees[id];
        
        return 100 - ((t.finishedCount().mul(100)).div(t.numOfWateres()));
    }
    
    /** 
     * @notice Returns ether amount planter would receive if lapseLimit were breached
     */ 
    function feeAmount(uint id) view public returns (uint) {
        require(id < treeCount);
        
        Tree  t = trees[id];
        
        return t.fundsRaised().sub(t.bountyPool()).wmul(t.fee());
    }
    
    /** 
     * @notice Emit an event when user joins a tree
     */ 
    function logJoin(uint _id, address _waterer) public {
        require(isTree[msg.sender] == true);
        
        _treesJoined[_waterer].push(_id);
        
        emit JoinTree(_id,_waterer);
    }
    
     /** 
     * @notice Emit an event when user waters a tree
     */ 
    function logWater(uint _id, address _waterer) public {
         require(isTree[msg.sender] == true);
         
         emit TreeWatered(_id, _waterer);
    }
    
    
     /** 
     * @notice Emit an event when user redeems fruit 
     */ 
    function logRedeem(uint _id, address _redeemer, uint _etherAmount) public {
         require(isTree[msg.sender] == true);
         
         emit FruitRedeemed( _id,  _redeemer, _etherAmount);
    }
    
    
     /** 
     * @notice Mint a new NFT for completing the tree
     */ 
    function mintNFT(address user) public {
         require(isTree[msg.sender] == true);
         
         _mint(user,nftCount); //NEW: Mint NFT as reward for beating the EtherTree
         nftCount++;
    }

     /** 
     * @notice Condense all pertinent tree information into a TreeInfo struct.
     * @dev See plant() for description of Tree parameters
     */ 
    function treeInfo(uint id) public view returns (TreeInfo memory) {
       TreeInfo memory t; 
        
        Tree  tree = trees[id];
        t.id = tree.id();
        t.bountyPool = tree.bountyPool();
        t.treeDuration = tree.treeDuration();
        t.paymentFrequency = tree.paymentFrequency();
        t.paymentSize = tree.paymentSize();
        t.lapseLimit = tree.lapseLimit();
        t.fee = tree.fee();
        t.startDate = tree.startDate();
        t.waterersNeeded = tree.waterersNeeded();
        t.planter = tree.planter();
        t.fundsRaised = tree.fundsRaised();
        t.finishedCount = tree.finishedCount();
        t.planted = tree.planted();
        t.waterersCount = tree.numOfWateres();
        
       return t; 
    }
    
     /** 
     * @notice Get an array list of a trees a user has participated in.
     * @param user - user to query information for
     * @return uint[] of all teees the user has joined or watered
     */ 
    function treesJoined(address user) public view returns (uint[] memory) {
        return _treesJoined[user];
    }
    
    
    event JoinTree(uint _id, address _waterer);
    event TreeWatered(uint _id, address _waterer);
    event TreePlanted(uint _id, uint _startDate, uint _endDate, uint _bounty, uint _feeAmt, uint _paymentSize, uint _paymentFrequency, uint _lapseLimit, uint _minWaterers);
    event FruitRedeemed(uint _id, address _redeemer, uint _etherAmount);
}


/// @title Tree
/// @author Michael C.
/// @notice The individual Tree contract which stores funds and connects to AAVE via the WETHGateway
/// @dev It is only intended to be messaged by the Arboretum, but third parties can check balance in explorers, code, and call info functions.
/// @dev The actual ether is tokenized as aWeth AAVE tokens and redeemed from the AAVE pool at a later time, earning interest
contract Tree is CoreType {
    
    using SafeMath for uint; 
    
    uint public id;               //Tree id
    uint public bountyPool;       //Size of the bounty (in wei)
    uint public treeDuration;     //How long the tree runs in seconds (timestamp)
    uint public paymentFrequency; //Number of payments to be made
    uint public paymentSize;      //Payment amount in ether (wei)
    uint public lapseLimit;
    uint public fee; //--NEW: Fee 
    uint public startDate;        //Time before watering period starts (in seconds)
    uint public waterersNeeded;   //Minimum players needed to join
    uint public planted;          //What time the tree was planted
    
    address payable public planter;       //Address of tree planter / owner
    address[] public waterers;    //Array of all tree waterers
    address public arboretum; //The factory that created the tree
    
    
    //--bookkeeping--//
    uint public fundsRaised;
    uint public finishedCount; //count of all players that made 'paymentFrequency' payments (finished watering)
    uint internal leftToClaim; //Same as finishedCount, goes down by 1 everytime someone redeems (fix for AAVE implementation)
    
    mapping (address => UserStats) public statsForTree;
   
    
    constructor(uint treeId,uint duration, uint freq, uint payment_size, uint lapse_limit, uint fee_amount ,uint start_date, uint min_waterers, address payable the_planter) public payable  {
        
        IWETHGateway gw = IWETHGateway(wethGateway);
        
         id = treeId;
         arboretum = msg.sender;
         bountyPool = msg.value;
         treeDuration = duration;
         paymentFrequency = freq;
         paymentSize = payment_size;
         lapseLimit = lapse_limit;
         fee = fee_amount;
         startDate = start_date;
         planter = the_planter; 
         waterersNeeded = min_waterers;
         planted = block.timestamp; 
        
         //Validation and processing payment 
         fundsRaised = fundsRaised.add(bountyPool);
         
         IERC20 aWeth = IERC20(gw.getAWETHAddress());
         aWeth.approve(wethGateway, MAX_UINT);
         if (msg.value > 0)
            gw.depositETH{value:msg.value}(address(this),0);
    }
    
    function water(address user) public payable {
        require (msg.sender == arboretum);
        Arboretum a = Arboretum(arboretum);
        
        UserStats memory stats = statsForTree[user];
        IWETHGateway gw = IWETHGateway(wethGateway);
        
        //if we are waiting for waterers to join:
        //(right now it is free to join an upcoming tree)
        if (block.timestamp < startDate) {
            require(stats.nextDue == 0, "Can only join the tree once"); //Only new players have a 0 next-due (Bugfix - makes sure you can only join once)
            require(msg.value == 0); //BUGFIX: make sure we don't keep ether for joining
            
            waterers.push(user);
            
            //Give the user stats per each tree they are a member
            stats.fruitEarned = 0;
            stats.nextDue = startDate.add(treeDuration.div(paymentFrequency));
            
            statsForTree[user] = stats;
            a.logJoin(id, user);
            return;
        }
        
        //if we are past the start date, before end date and min waterers is met: 
        //bugfix: remove redundant end check
        if (block.timestamp >= startDate && waterers.length >= waterersNeeded) {
             stats = statsForTree[user];
            
            require (msg.value == paymentSize, "Incorrect payment amount."); //make sure waterer is sending the right payment
            require (block.timestamp <= stats.nextDue && stats.nextDue > 0, "You lapsed. No fruit for you!"); //make sure payment is happening before the due period, and user pre-joined by watering
            require (block.timestamp >= stats.lastDue, "Wait until the next payment cycle.");
            
            fundsRaised = fundsRaised.add(msg.value);
            statsForTree[user].fruitEarned += 1;
            statsForTree[user].lastDue = stats.nextDue;
            statsForTree[user].nextDue = stats.nextDue.add(treeDuration.div(paymentFrequency));
            
            if (statsForTree[user].fruitEarned == paymentFrequency) { //--NEW: Keeps track of count of all players who met their payments 
               finishedCount++; 
               leftToClaim++;
            }
            
            gw.depositETH{value:msg.value}(address(this),0);
            a.logWater(id, user);
        } else {
            revert("Not enough waterers. Bye Felicia."); //log and disallow watering if not enough joined
        }
        
    }
    
    function redeem(address payable user) public {
        require (msg.sender == arboretum);
        Arboretum a = Arboretum(arboretum);
        IWETHGateway gw = IWETHGateway(wethGateway);
        IERC20 aWeth = IERC20(gw.getAWETHAddress());
        
        if (user == planter) {
          if (waterers.length < waterersNeeded) {
             require(user == planter, "Must be planter to redeem bounty.");
             require(bountyPool > 0, "Bounty already returned to planter or no bounty");
             
             uint bounty = aWeth.balanceOf(address(this)); //Nobody played so planter gets back bounty + interest
             bountyPool = 0; 
             fundsRaised = 0; 
            
             a.logRedeem(id, user, bounty);
             gw.withdrawETH(bounty, user);
             return; 
          }

          //Send the bounty+fee if lapse limit hit:
          if (lapseLimit <= a.lapsePercent(id)) {
              uint bounty = bountyPool;
              uint theFee = a.feeAmount(id);
              bountyPool = 0;
              fee = 0;
              fundsRaised = fundsRaised.sub(bounty);
              a.logRedeem(id, user, bounty.add(theFee));
              gw.withdrawETH(bounty.add(theFee), user);
          }
          
       } else {
           require(statsForTree[user].fruitEarned == paymentFrequency, "Must make all payments to redeem");
            
               uint amountToSend = 0;
               if (lapseLimit > a.lapsePercent(id)) {
                
                    amountToSend = aWeth.balanceOf(address(this)).div(leftToClaim); //Now AAVE interest is split between players
                    statsForTree[user].fruitEarned = 0;
                    leftToClaim = leftToClaim.sub(1);
                    a.logRedeem(id, user, amountToSend);
                    gw.withdrawETH(amountToSend, user);
            
                } else {
                   
                   uint bounty = bountyPool;
                   uint theFee = a.feeAmount(id);
                   uint payments = aWeth.balanceOf(address(this)).sub(bounty).sub(theFee); //Once again: interest earned (ever-increasing aToken balance), but less the bounty+fee
                   amountToSend = payments.div(leftToClaim);
                   statsForTree[user].fruitEarned = 0;
                   leftToClaim = leftToClaim.sub(1);
                   a.logRedeem(id, user, amountToSend);
                   gw.withdrawETH(amountToSend, user);
             }       
          }
       
          a.mintNFT(msg.sender);
    }
    
    
    function numOfWateres() public view returns (uint) {
        return waterers.length;
    }
}



/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import Faq from 'react-faq-component';
import planterDiagram from "../img/planterDiagram.png";
import waterDiagram from "../img/waterDiagram.png";



export default function HowTo() {


  const sectionStyle = {
    textAlign: "left"
  }
  const textStyle = {
    textAlign: "left",
    fontSize:"16px",
  }
  const liElStyle={
    textAlign: "left",
    fontSize:"16px",
    marginLeft: "40px"
  }
  const style={
    textAlign: "left",
    fontSize:"16px",
    marginLeft: "40px"
  }


  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        {/* <h2>{treeCount} - Trees - </h2> */}

        <div style={{borderBottom : "solid gray 1px"}}>
          <h1 style={sectionStyle} >Overview</h1>

          <p style={textStyle}>There are two types of Players. <strong>Planters</strong> and <strong>Waterers</strong>. <strong>Planters</strong> determine the Parameters of the game by <strong>Planting Seeds</strong>. 
          <strong>Waterers</strong> choose a seed and then commit to <strong>Waterering</strong> this <strong>Tree</strong> over a given period. To play, you will need {" "}
                <a href="https://docs.metamask.io/guide/">
                  Metamask
                </a>{" "} and some <strong> Ether </strong> 
            so that you can engage with the Smart Contracts.</p>

        </div>
        <div>
        <img alt="planter" src={planterDiagram} style={{ margin: "auto" , width: "500px"}} />
        </div>
        <div>
        <p style={textStyle}><strong>Planter</strong>: The Planter is a person with a dream to innovate and the means to start creating the <strong>Trees</strong> that 
          will one day stand tall and bare Fruits that feed the community. 
        </p>
        <ul style={style}>
          <li>
          <strong>Step 1:</strong> Navigate to the <strong>Forest</strong> and create a tree by planting a <strong>Seed</strong>. (Pay to Fertilise)
          </li>
          <li>
          <strong>Step 2:</strong> Set the <strong>Parameters</strong> that influence the Tree’s risk and return factors for the Waterers. (See Parameters below)
          </li>
          <li>
          <strong>Step 3:</strong> A <strong>Smart Contract</strong> is created and the Seed is ready to be Watered - but first share your Seed with the community to find <strong>Waters</strong>.
          </li>
        </ul>

        <p style={textStyle}>The Planter is taking <strong>higher risks for higher returns</strong>.</p>

        <p style={textStyle}>Outcomes for the Planter:</p>
        <ul style={textStyle}>
          <li>
          If not enough Waterers sign up to Water the Tree before the Start Date, the
          Bounty is returned.
          </li>
          <li>
          If none of the Waterers neglect to Water the Tree, the Planter gets nothing.
          </li>
          <li>
          If Waterers neglect to Water the Tree, even once, they are locked out of the Smart Contract and the Planter receives their Bounty back and a percentage of the total Watering Fees collected from those that were locked out. 
          The amount depends on the Parameters they set. The Planter also receives an NFT of the matured Tree.
          </li>
        </ul>

        </div>

        <div>
        <img alt="waterer" src={waterDiagram} style={{ margin: "auto" , width: "500px"}} />
        </div>

        <div>
        <p style={textStyle}><strong>Waterer</strong>: The Waterer wants the leisure of shopping around for pre-designed Seeds to invest in. 
          They believe in their commitment to Watering their chosen Trees till maturation and will enjoy a share of their Tree’s Fruits for this commitment. 
        </p>
        <ul style={style}>
          <li>
          <strong>Step 1:</strong> Navigate to the Forest and browse a catalogue of Seeds with tailored Parameters.
          </li>
          <li>
          <strong>Step 2:</strong> Commit to Watering as many Trees as you like by signing the Smart Contract with your MetaMask wallet.
          </li>
          <li>
          <strong>Step 3:</strong> Remember to Water your Trees when required, as per each Tree’s respective Parameters.
          </li>
          <li>
          <strong>Step 4:</strong> Fulfill all of your Watering (payment) commitments and receive a portion of the Fruits 
          (lapse funds) and an NFT of the matured Trees once the duration ends.
          </li>
        </ul>

        <p style={textStyle}>Waterers are taking <strong>medium risks for medium returns</strong></p>

        <p style={textStyle}>Outcomes for the Waterer:</p>
        <ul style={textStyle}>
          <li>
          They forget to Water the Tree and get no fruits.
          </li>
          <li>
          They Water till Tree maturation and receive a portion of the Fruits, amounts determined by how the other players behaved in relation to the Parameters. 
          Watering for the full duration also awards the Water with an NFT of the matured Tree.
          </li>

        </ul>

        </div>
        
        
        <div>
          <h1 style={sectionStyle}>Parameters</h1>
          <p style={textStyle}>There are numerous parameters for Planters to decide on that make their trees uniquely desirable investments, with varying risk and commitment 
            levels for Waterers. Different combinations of these parameters may even influence the rarity of the trees grown.</p>

          <div>
            <ul style={textStyle}>
              <li>
              <strong>Duration:</strong> How long it takes for a Seed to become a Fruit bearing Tree.
                <ul style={liElStyle}>
                  <li>
                  E.g. week, month, year, etc.
                  </li>
                </ul>

              </li>
              <li>
              <strong>Payment Frequency:</strong> How often the Tree needs to be Watered.
              <ul style={liElStyle}>
                  <li>
                  E.g. daily, weekly, monthly, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Payment Amount:</strong> How much Eth is needed to Water the Tree.
                <ul style={liElStyle}>
                  <li>
                  E.g. 0.01Eth, 0.1Eth, 1Eth, etc.
                    
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Number of Waterers at Start:</strong> The minimum number of Waterers needed to germinate the Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 1, 10, 100, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Start Date:</strong> The day of germination if the minimum number of Waterers has been met.
                <ul style={liElStyle}>
                  <li>
                  Any future date.
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Planter's Fee:</strong> The percentage of the Fruit that the Planter earns for Planting the Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 0.5%, 1%, 5%, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Fertiliser:</strong> Some Ether that the Planter deposits when they plant a Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 1Eth, 10Eth, 100Eth, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                <strong>Lapse Limit:</strong> The condition that determines if the Fertiliser is returned to the Planter or shared amongst the Waterers.
                <ul style={liElStyle}>
                  <li>
                  E.g. 25%, 50%, 75%, etc.
                  </li>
                </ul>
                
                </li>
            </ul>
          </div>
        </div>     
        
        <div>
          <h1 style={sectionStyle}>Game Variables At Harvest (end of contract duration)</h1>

        <div>
            <ul style={textStyle}>
              <li>
              Number of Waterers remaining.
                <ul style={liElStyle}>
                  <li>
                  Count of Waterers who didn’t lapse.
                  </li>
                  <li>
                  Number of Waterers at Start - Number of Lapses.
                  </li>
                </ul>

              </li>
              <li>
              Actual Lapses.
              <ul style={liElStyle}>
                  <li>
                  The percentage of Waterers who lapsed during the game.
                  </li>
                  <li>
                  Number of Waterers Remaining / Number of Waterers at Start.
                  </li>
                </ul>
                
                </li>
                <li>
                Fruit.
                <ul style={liElStyle}>
                  <li>
                  The total fund of the smart contract.
                    
                  </li>
                  <li>
                  Max = Fertiliser + Payment Amount * Payment Frequency * Number of Waterers.
                    
                  </li>
                </ul>
                
                </li>
                <li>
                Number of Waterers at Start: The minimum number of Waterers needed to germinate the Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 1, 10, 100, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                Start Date: The day of germination if the minimum number of Waterers has been met.
                <ul style={liElStyle}>
                  <li>
                  Any future date.
                  </li>
                </ul>
                
                </li>
                <li>
                Planter’s Fee: The percentage of the Fruit that the Planter earns for Planting the Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 0.5%, 1%, 5%, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                Fertiliser: Some Ether that the Planter deposits when they plant a Seed.
                <ul style={liElStyle}>
                  <li>
                  E.g. 1Eth, 10Eth, 100Eth, etc.
                  </li>
                </ul>
                
                </li>
                <li>
                Lapse Limit: The condition that determines if the Fertiliser is returned to the Planter or shared amongst the Waterers.
                <ul style={liElStyle}>
                  <li>
                  E.g. 25%, 50%, 75%, etc.
                  </li>
                </ul>
                
                </li>
            </ul>
          </div>
        </div>

        <div>
          <h1 style={sectionStyle}>Trees</h1>


          <div>
            <p style={textStyle}>There are 5 levels of rarity of the final NFT, which is represented by its outer ring:</p>
            <ul style={style}>
              <li>
              <strong>Silver:</strong> 64% chance of acquisition.
              </li>
              <li>
              <strong>Gold:</strong> 20% chance of acquisition.
                </li>
                <li>
                <strong>Blue:</strong> 10% chance of acquisition.
                </li>
                <li>
                <strong>Purple:</strong> 5% chance of acquisition.
                </li>
                <li>
                <strong>Ether/Seasonal:</strong> 1% chance of acquisition. The Ether tree is the norm here, 
                but is replaced with a seasonal tree during limited periods. e.g. Easter, Christmas etc.
                </li>
            </ul>
          </div>
          <div>
            <p style={textStyle}>We currently have 1 tree type at each rarity stage:</p>
            <ul style={style}>
              <li>
              <strong>Silver:</strong> Apple.
              </li>
              <li>
              <strong>Gold:</strong> Banana.
                </li>
                <li>
                <strong>Blue:</strong> Coconut.
                </li>
                <li>
                <strong>Purple:</strong>
                </li>
                <li>
                <strong>Ether/Seasonal:</strong> It’s a tree that grows Ether fruit.
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    


    
  );
}

/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import "./About.css"
import sampleImg from "../img/plant.png"
import castle from "../teamPfp/castle.jpg"
import sleepy from "../teamPfp/sleepy.jpg"
import ziggy from "../teamPfp/ziggy.jpg"
import adil from "../teamPfp/adil.jpg"
import mj from "../teamPfp/mj.png"


export default function About() {

  const sectionStyle = {
    textAlign: "left"
  }
  const textStyle = {
    textAlign: "left",
    fontSize:"16px"
  }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        {/* <h2>{treeCount} - Trees - </h2> */}

        

        <div>
          <h1 style={sectionStyle}>
            What is Ether Tree?
          </h1>
          <p style={textStyle}>
          EtherTree is a decentralised application built on Ethereum. 
          It is a stake game where players are exposed to Lapse Risk. 
          The gamification is around planting seeds, watering trees and then harvesting their fruit.
          </p>
        </div>
        <div style={{paddingTop : "10px"}}>
          <h1 style={sectionStyle}>
            Why Should I Play Ether Tree?
          </h1>
          <p style={textStyle}>
          Investors can lower their total risk by diversifying across different assets. The less correlation, 
          the greater the diversification benefit. When markets fall, traditional assets see their correlation with each other increase. 
          This means the diversification benefit is reduced when it is needed most. EtherTree introduces investors to Lapse Risk which 
          has a negative correlation to traditional assets. This means it can provide a portfolio with a real diversification benefit and reduce total risk.
          </p>
        </div>

    <div className="container">
    <h1 className="heading">Meet Our Team</h1>

    <div className="profiles">
      <div className="profile">
        <img src={mj} class="profile-img" />

        <h3 className="user-name">Michael Jordan</h3>
        
        <p>Michael is a creative actuary who has been thinking about blockchain since 2014.</p>
      </div>
      <div className="profile">
        <img src={ziggy} style={{}}  className="profile-img" />

        <h3 className="user-name">Zakiah Ray</h3>
        
        <p>Zakiah is a designer with a background in FinTech and a new-found passion for crypto and NFTs.</p>
      </div>
      <div className="profile">
        <img src={castle}  className="profile-img" />

        <h3 className="user-name">Michael Colton</h3>
        
        <p>Michael discovered Bitcoin in 2011 and started mining and trading shortly thereafter. His enthusiasm of the protocol and for software development lead him to discover Ethereum, 
          and he began Solidity development for decentralized apps in 2017, 
          including contributions to some of the first NFT platforms, such as Curio cards. His other hobbies include photography and retro gaming.</p>
      </div>
    </div>


    <div className="profiles">
      <div className="profile">
        <img src={adil}  className="profile-img" />

        <h3 className="user-name">Adil Hussain</h3>
        
        <p>Adil is a full Stack JavaScript developer and a second year computer science student who’s interested in learning more about blockchain.</p>
      </div>
      <div className="profile">
        <img src={sleepy}  className="profile-img" />

        <h3 className="user-name">Himanshu Sethi</h3>
        
        <p>developer</p>
      </div>
    </div>
  </div>


        


      </div>
    </div>

  );
}

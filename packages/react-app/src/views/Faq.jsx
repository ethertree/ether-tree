/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import Faq from 'react-faq-component';

const data = {
  title: "What do I need to play?",
  rows: [
    {
      title:<h1>A computer running Chrome or Firefox?</h1>,
      content: <div>Can I use a different browser?<p>We recommend sticking with Chrome or Firefox. It may be technically possible to use another browser, but we can’t guarantee optimal performance, so you may want to steer clear.
      </p><div>Can I log in from multiple computers?<p>You can use CryptoKitties from multiple computers as long as you have your digital wallet installed on both.</p></div></div>,

    },{

      title:<h1>A digital wallet</h1>,
      content: <div><p><h1>Installing your digital wallet</h1>
      <ul>
      <li>To use CryptoKitties, you need a digital wallet. We support all digital wallets, but recommend <a href="https://www.meetdapper.com/?utm_source=twitter&amp;utm_medium=organicsocial&amp;utm_campaign=meetdapper">Dapper</a> for the best CryptoKitties experience. </li>
      <li>You’ll need to put money in your wallet to make your first purchase. We can show you how to do that, too.</li>
      <li>Note: A digital wallet acts like a bank account — treat it with respect and make sure you don’t forget your password or lose your recovery kit.</li>
      </ul>
      <h1 >What is a “wallet address”?</h1>
      <p>Your public wallet address (e.g. 0xaba935f589805095a892ecefdb6eb83eff45d67) is a unique identifier for your wallet. It’s like a name. You can share it freely with others, and it’s used to direct assets to your wallet. </p>
      </p></div>
    },{

      title:<h1>Ethereum, a digital currency</h1>,
      content: <div class="Collapse-body"><p><h2 id="whats-ether-eth-why-do-i-need-it">What’s ether (ETH)? Why do I need it?</h2>
      <ul>
      <li>Ether is a digital currency that powers the Ethereum network, which is what CryptoKitties is built on. Ether acts like any other currency — its value fluctuates with the market.</li>
      <li>You need to convert your currency (e.g. USD, CAD, GBP) into ether to pay for things — such as CryptoKitties — on the Ethereum network.</li>
      </ul>
      </p></div>

    }
  
  ]
}
const styles = {
  // bgColor: 'white',
  titleTextColor: "blue",
  rowTitleColor: "blue",
  // rowContentColor: 'grey',
  // arrowColor: "red",
};

export default function Faqs() {



  return (



    <div style={{display: "flex",justifyContent: "center"}}>


   

      <div className="container"style={{width:"1000px", margin: "0 auto"}}>

      <Faq data={data} style={styles}/>

      </div>
      
    </div>


    
    
  );
}

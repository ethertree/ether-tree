/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import Faq from "react-faq-component";

const textContentTitle = {
  textAlign : "left"
}
const textContent = {
  textAlign : "left",
  marginLeft: "40px"
}

const data = {
  title: "What do I need to play?",
  rows: [
    {
      title: <h1>A computer running Chrome or Firefox?</h1>,
      content: (
        <div style={textContentTitle}>
          Can I use a different browser?
          <p>
            We recommend sticking with Chrome or Firefox. It may be technically possible to use another browser, but we
            can’t guarantee optimal performance, so you may want to steer clear.
          </p>
          <div style={textContentTitle}>
            Can I log in from multiple computers?
            <p>
              You can use EtherTree from multiple computers as long as you have your digital wallet installed on
              both.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: <h1>A digital wallet</h1>,
      content: (
        <div>
          <p>
            <h1 style={textContentTitle}>Installing your digital wallet</h1>
            <ul style={textContent}>
              <li>
                To use EtherTree, you need a digital wallet. We support{" "}
                <a href="https://docs.metamask.io/guide/">
                  Metamask
                </a>{" "}
                for the best Ether Tree experience.{" "}
              </li>
              <li>
                You’ll need to put money in your wallet to make your first purchase. We can show you how to do that,
                too.
              </li>
              <li>
                Note: A digital wallet acts like a bank account — treat it with respect and make sure you don’t forget
                your password or lose your recovery kit.
              </li>
            </ul>
            <h1 style={textContentTitle}>What is a “wallet address”?</h1>
            <p style={textContentTitle}>
              Your public wallet address (e.g. 0xaba933f589805095a892ecefdb6eb73eff44d67) is a unique identifier for
              your wallet. It’s like a name. You can share it freely with others, and it’s used to direct assets to your
              wallet.{" "}
            </p>
          </p>
        </div>
      ),
    },
    {
      title: <h1>Ethereum, a digital currency</h1>,
      content: (
        <div class="Collapse-body">
          <p>
            <h1 style={textContentTitle}>What’s ether (ETH)? Why do I need it?</h1>
            <ul style={textContentTitle}>
              <li>
                Ether is a digital currency that powers the Ethereum network, which is what EtherTree is built on.
                Ether acts like any other currency — its value fluctuates with the market.
              </li>
              <li>
                You need to convert your currency (e.g. USD, CAD, GBP) into ether to pay for things — such as
                EtherTree — on the Ethereum network.
              </li>
            </ul>
          </p>
        </div>
      ),
    },
  ],
};

const data2 = {
  title: "Ethics Of EtherTree",
  rows: [
    {
      title: <h1>EtherTree is a wealth redistribution game</h1>,
      content: (
        <div>
          <p>
            <h1 style={textContentTitle}>Is it alright to win at the expense of someone else?</h1>
            <ul style={textContent}>
              <li>
              The majority of us would agree that it is wrong to steal from others or trick them into a bad deal.
              </li>
              <li>
              The majority of us would agree that if the rules are transparent and that if entering the game is entirely optional, then there is no ethical dilemma.
              </li>
            </ul>

          </p>
        </div>
      ),
    },
    {
      title: <h1 style={textContentTitle}>EtherTree is built on the ethereum blockchain and so all parameters and logic are transparent.</h1>,
      content: (
        <div class="Collapse-body">
          <p>
            <h1 style={textContentTitle}>No one is forced to play EtherTree.</h1>
            <p style={textContentTitle}>
            So yes it might not be nice to win at someone else’s expense but since they 
            chose to enter the game and had perfect information about it beforehand, 
            it is extremely difficult to make the case that it is unethical.
            </p>
          </p>

        </div>
      ),
    }
      
   
  ],
};
const styles = {
  // bgColor: 'white',
  titleTextColor: "blue",
  rowTitleColor: "blue",
  // rowContentColor: 'grey',
  // arrowColor: "red",
};

export default function Faqs() {
  return (
    <div style={{ display: "grid", gridTemplate: "1fr / 1fr" ,placeItems:"center", padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
      <div  style={{ width: "850px", margin: "0 auto",zIndex:"1",paddingBottom : "50px" }}>
        <Faq data={data} style={styles} />
      </div>
      
      <div style={{ width: "850px", margin: "0 auto",zIndex:"2" }}>
        <Faq data={data2} style={styles} />
      </div>
    </div>
  );
}

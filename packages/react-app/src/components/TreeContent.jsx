import React, { useState, useEffect } from "react";
import { usePoller } from "eth-hooks";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import tryToDisplay from "./Contract/utils";
import { useContractReader, useEventListener } from "../hooks/index";
import { formatEther, parseEther } from "@ethersproject/units";

export default function TreeContent(props) {
  //const [bountyPool, setBountyPool] = useState();
  const [treeInfo, setTreeInfo] = useState();

  // Update the document title using the browser API
  //console.log(props);
  console.log(props.id);
  const treeDetails = useContractReader(props.readContracts, "Arboretum", "trees", [props.id]);
  const MyTreeStats = useContractReader(props.readContracts, "Arboretum", "statsForTree", [props.id, props.address]);
  // console.log(
  //   "MyTreeStats : ",
  //   MyTreeStats,
  //   MyTreeStats ? tryToDisplay(MyTreeStats.fruitEarned) : "",
  //   MyTreeStats,
  //   MyTreeStats ? tryToDisplay(MyTreeStats.lastDue) : "",
  //   MyTreeStats,
  //   MyTreeStats ? tryToDisplay(MyTreeStats.nextDue) : "",
  // );
  console.log("tree : ", props.id, treeDetails, treeDetails ? tryToDisplay(treeDetails.bountyPool) : "");

  function getStateDate(UNIXimestamp) {
    const a = new Date(UNIXimestamp * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;

    // const d = new Date(UNIX_timestamp * 1000);
    // return d.toGMTString();
  }

  function getDurationInDate(duration) {
    switch (duration) {
      case 604800:
        return "1 Week";
      case 1209600:
        return "2 Week";
      case 2629746:
        return "1 Month";
      case 5259492:
        return "2 Month";
      case 10518984:
        return "4 Months";
      case 15778476:
        return "6 Months";
      case 31556952:
        return "1 Year";
      default:
        return "0";
    }
  }

  function getEndDate(startDate, duration) {
    return getStateDate(startDate + duration);
  }

  function getCountdown(startDate) {
    const now = new Date().getTime();
    const distance = startDate * 1000 - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }

  function WaterBtnDisable(date) {
    const startDate = date * 1000;
    const now = new Date().getTime();
    return startDate < now;
  }

  return (
    <Card style={{ width: 300 }} id={props.e} key={props.e}>
      <div>
        <p>Bounty : {treeDetails ? tryToDisplay(treeDetails.bountyPool) : ""}</p>
        <p>fee : {treeDetails ? tryToDisplay(treeDetails.fee) : ""}</p>
        <p>paymentFrequency : {treeDetails ? tryToDisplay(treeDetails.paymentFrequency) : ""}</p>
        <p>paymentSize : {treeDetails ? tryToDisplay(treeDetails.paymentSize) : ""}</p>
        <p>startDate : {treeDetails ? getStateDate(tryToDisplay(treeDetails.startDate)) : ""}</p>
        <p>
          endDate :{" "}
          {treeDetails ? getEndDate(tryToDisplay(treeDetails.startDate), tryToDisplay(treeDetails.treeDuration)) : ""}
        </p>
        <p>treeDuration : {treeDetails ? getDurationInDate(tryToDisplay(treeDetails.treeDuration)) : ""}</p>
        <p>waterersNeeded : {treeDetails ? tryToDisplay(treeDetails.waterersNeeded) : ""}</p>
        <p>Countdown : {treeDetails ? getCountdown(tryToDisplay(treeDetails.startDate)) : ""}</p>
      </div>
      <div>
        <Button
          disabled={treeDetails ? WaterBtnDisable(tryToDisplay(treeDetails.startDate)) : ""}
          onClick={() => {
            /* look how we call setPurpose AND send some value along */
            props.tx(
              props.writeContracts.Arboretum.water(props.id, {
                value: treeDetails ? parseEther(formatEther(treeDetails.paymentSize)) : "",
              }),
            );
          }}
        >
          Water It
        </Button>
        <Button
          onClick={() => {
            /* look how we call setPurpose AND send some value along */
            props.tx(props.writeContracts.Arboretum.redeem(props.id));
          }}
        >
          Redeem
        </Button>
      </div>
      <Divider />
      <div>
        <p>fruitEarned : {MyTreeStats ? tryToDisplay(MyTreeStats.fruitEarned) : ""}</p>
        <p>lastDue : {MyTreeStats ? getCountdown(tryToDisplay(MyTreeStats.lastDue)) : ""}</p>
        <p>lastDue(seconds) : {MyTreeStats ? tryToDisplay(MyTreeStats.lastDue) : ""}</p>
        <p>nextDue : {MyTreeStats ? getCountdown(tryToDisplay(MyTreeStats.nextDue)) : ""}</p>
      </div>
    </Card>
  );
}

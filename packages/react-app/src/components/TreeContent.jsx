import React, { useState, useEffect } from "react";
import { usePoller } from "eth-hooks";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Popover } from "antd";
import tryToDisplay from "./Contract/utils";
import { useContractReader, useEventListener } from "../hooks/index";
import { formatEther, parseEther } from "@ethersproject/units";

export default function TreeContent(props) {
  const { Meta } = Card;
  const [treeInfo, setTreeInfo] = useState();
  const treeDetails = useContractReader(props.readContracts, "Arboretum", "treeInfo", [props.id]);
  const myTreeStats = useContractReader(props.readContracts, "Arboretum", "statsForTree", [props.id, props.address]);

  function getDate(UNIXimestamp) {
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
    return getDate(startDate + duration);
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

  function canRedeem() {
    if (treeDetails && myTreeStats) {
      const now = new Date().getTime();

      let endDate = (tryToDisplay(treeDetails.startDate) + tryToDisplay(treeDetails.treeDuration)) * 1000;
      if (tryToDisplay(myTreeStats[0]) == tryToDisplay(treeDetails.paymentFrequency) && now > endDate) {
        return false;
      } else {
        return true;
      }
    }
  }

  function waterBtnDisable() {
    if (treeDetails && myTreeStats) {
      if (props.address !== treeDetails.planter) {
        const now = new Date().getTime();
        let startDate = tryToDisplay(treeDetails.startDate) * 1000;
        let endDate = (tryToDisplay(treeDetails.startDate) + tryToDisplay(treeDetails.treeDuration)) * 1000;
        let nextDueDate = tryToDisplay(myTreeStats[1]) * 1000;
        let lastDueDate = tryToDisplay(myTreeStats[2]) * 1000;
        if (endDate < now) {
          //console.log("tree is done, now you can redeem");
          return true;
        } else if (nextDueDate > endDate) {
          //console.log("tree is done");
          return true;
        } else if (startDate > now) {
          //console.log("people can join");
          return false;
        } else {
          console.log(nextDueDate, lastDueDate, now);
          if (nextDueDate > now && lastDueDate == 0) {
            //console.log("first payment");
            return false;
          } else if (nextDueDate > now && lastDueDate < now) {
            //console.log("people can water");
            return false;
          } else {
            //console.log("have to wait till next due date");
            return true;
          }
        }
      } else {
        return true;
      }
    }
  }

  function waterIt(date, waterVal) {
    const startDate = date * 1000;
    const now = new Date().getTime();
    if (startDate > now) {
      return parseEther("0");
    } else {
      return parseEther(waterVal);
    }
  }

  function getTreeType() {
    if (treeDetails && myTreeStats) {
      let whichTree =
        (tryToDisplay(treeDetails.planted) +
          Math.floor(tryToDisplay(treeDetails.startDate) / 10000) +
          Math.floor(tryToDisplay(treeDetails.treeDuration) / 10000) +
          tryToDisplay(treeDetails.id)) %
        5;
      let getStage = (myTreeStats[0] / treeDetails.paymentFrequency) * 100;

      let whichStage = getStagePercentage(getStage);
      return whichTree + "/" + whichStage;
    } else {
      return "0/0";
    }
  }

  function getStagePercentage(statePercentage) {
    if (statePercentage <= 12.5) {
      return 0;
    } else if (statePercentage > 12.5 && statePercentage <= 25) {
      return 1;
    } else if (statePercentage > 25 && statePercentage <= 37.5) {
      return 2;
    } else if (statePercentage > 37.5 && statePercentage <= 50) {
      return 3;
    } else if (statePercentage > 50 && statePercentage <= 62.5) {
      return 4;
    } else if (statePercentage > 62.5 && statePercentage <= 75) {
      return 5;
    } else if (statePercentage > 75 && statePercentage <= 87.5) {
      return 6;
    } else if (statePercentage > 87.5 && statePercentage <= 100) {
      return 7;
    }
  }

  return (
    <Card
      id={props.e}
      key={props.e}
      hoverable
      style={{ width: 300, marginBottom: "30px" }}
      cover={<img alt="tree" src={require(`../tree/${getTreeType()}.png`)} />}
    >
      <h3>Bounty : {treeDetails ? tryToDisplay(treeDetails.bountyPool) : ""}</h3>
      <p>Start Date : {treeDetails ? getDate(tryToDisplay(treeDetails.startDate)) : ""}</p>
      <p>nextDue Date : {myTreeStats ? getDate(tryToDisplay(myTreeStats[1])) : ""}</p>
      <p>lastDue Date : {myTreeStats ? getDate(tryToDisplay(myTreeStats[2])) : ""}</p>
      <p>
        End Date :{" "}
        {treeDetails ? getEndDate(tryToDisplay(treeDetails.startDate), tryToDisplay(treeDetails.treeDuration)) : ""}
      </p>
      <p>Waterers Count : {treeDetails ? tryToDisplay(treeDetails.waterersCount) : ""}</p>
      <p>Min Waterers Needed : {treeDetails ? tryToDisplay(treeDetails.waterersNeeded) : ""}</p>

      <p>Fee : {treeDetails ? tryToDisplay(treeDetails.fee) : ""}</p>
      <p>Fruit : {myTreeStats ? tryToDisplay(myTreeStats[0]) : ""}</p>
      <p>Frequency: {treeDetails ? tryToDisplay(treeDetails.paymentFrequency) : ""}</p>
      <p>Payment Size : {treeDetails ? tryToDisplay(treeDetails.paymentSize) : ""}</p>

      <Button
        disabled={waterBtnDisable()}
        onClick={() => {
          props.tx(
            props.writeContracts.Arboretum.water(props.id, {
              value: treeDetails
                ? waterIt(tryToDisplay(treeDetails.startDate), formatEther(treeDetails.paymentSize))
                : "",
            }),
          );
        }}
      >
        Water It
      </Button>
      <Button
        disabled={canRedeem()}
        onClick={() => {
          props.tx(props.writeContracts.Arboretum.redeem(props.id));
        }}
      >
        Redeem
      </Button>
    </Card>
  );
}

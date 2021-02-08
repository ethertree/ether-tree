/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Col, Row } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener } from "../hooks/index";
import tryToDisplay from "../components/Contract/utils";
import { TreeContent } from "../components";
import plant from "../img/plant.png";
export default function MyTree({
  treePlantedEvents,
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  treeCount,
  tx,
  readContracts,
  writeContracts,
}) {
  const myTrees = useContractReader(readContracts, "Arboretum", "treesJoined", [address]);
  console.log("myTrees : ", myTrees);
  // if (myTrees) {
  //   console.log("mewo : ", tryToDisplay(myTrees.bountyPool));
  //   console.log("mewo : ", tryToDisplay(myTrees.fee));
  //   console.log("mewo : ", tryToDisplay(myTrees.paymentFrequency));
  //   console.log("Start Date : ", tryToDisplay(myTrees.startDate), new Date(tryToDisplay(myTrees.startDate) * 1000));
  // }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        {/* <h2>{treeCount} - Trees - </h2> */}
        {myTrees && myTrees.length > 0 ? (
          <div>
            <h1>My Trees</h1>
            <div className="site-card-wrapper">
              <Row gutter={16}>
                {myTrees
                  ? myTrees.map(i => {
                      let ii = tryToDisplay(i);
                      console.log("ii--", ii);
                      return (
                        <Col span={8}>
                          <TreeContent
                            address={address}
                            key={ii}
                            id={ii}
                            localProvider={localProvider}
                            userProvider={userProvider}
                            mainnetProvide={mainnetProvider}
                            treePlantedEvents={treePlantedEvents}
                            tx={tx}
                            useContractReader={useContractReader}
                            writeContracts={writeContracts}
                            readContracts={readContracts}
                          />
                        </Col>
                      );
                    })
                  : ""}
              </Row>
            </div>
          </div>
        ) : (
          <h1>You are not watering any trees</h1>
        )}
      </div>
    </div>
  );
}

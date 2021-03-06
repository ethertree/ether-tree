/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Col, Row } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener } from "../hooks/index";
import tryToDisplay from "../components/Contract/utils";
import { TreeContent } from "../components";
import plant from "../img/plant.png";
export default function Trees({
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
  const [newPurpose, setNewPurpose] = useState("loading...");

  // const tree1 = useContractReader(readContracts, "Arboretum", "trees", [0]);
  // console.log("tree1 : ", tree1);
  // if (tree1) {
  //   console.log("mewo : ", tryToDisplay(tree1.bountyPool));
  //   console.log("mewo : ", tryToDisplay(tree1.fee));
  //   console.log("mewo : ", tryToDisplay(tree1.paymentFrequency));
  //   console.log("Start Date : ", tryToDisplay(tree1.startDate), new Date(tryToDisplay(tree1.startDate) * 1000));
  // }

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ padding: 16, width: 1000, margin: "auto", marginTop: 64 }}>
        {/* <h2>{treeCount} - Trees - </h2> */}

        <h1>Trees in forest</h1>
        {treeCount > 0 ? (
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  id="0s"
                  key="0s"
                  hoverable
                  onClick={() => window.location.href='/plant'}
                  style={{ width: 300, marginBottom: "30px" }}
                  cover={<img alt="tree" src={plant} />}
                >                  
                  <h3>Plant A Seed</h3>
                  <></>
                  <></>
                </Card>
              </Col>
              {[...Array(treeCount)].map((i, e) => (
                <Col span={8}>
                  <TreeContent
                    address={address}
                    key={e}
                    id={e}
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
              ))}
            </Row>
          </div>
        ) : (
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  id="0s"
                  key="0s"
                  hoverable
                  onClick={() => window.location.href='/plant'}
                  style={{ width: 300, marginBottom: "30px" }}
                  cover={<img alt="tree" src={plant} />}
                >                  
                  <h3>Plant A Seed</h3>
                  <></>
                  <></>
                </Card>
              </Col>             
              {/* <Col span={8}>No Trees, World need some trees</Col> */}
            </Row>            
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import {
  Form,
  Button,
  List,
  Tooltip,
  Divider,
  Input,
  Card,
  Space,
  DatePicker,
  Slider,
  Switch,
  Progress,
  Select,
  Spin,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import moment from "moment";

export default function PlantTree({
  purpose,
  treeCount,
  setPurposeEvents,
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  const [newFrequency, setNewFrequency] = useState("loading...");
  const [newPaymentSize, setNewPaymentSize] = useState("loading...");
  const [newLapseLimit, setNewLapseLimit] = useState("loading...");
  const [newDuration, setNewDuration] = useState("loading...");
  const [newMinWaterers, setNewMinWaterers] = useState("loading...");
  const [newBounty, setNewBounty] = useState("loading...");
  const [newStartDate1, setNewStartDate1] = useState("loading...");

  const dateFormat = "MM/DD/YYYY";
  const { Option } = Select;

  const customFormat = value => `custom format: ${value.format(dateFormat)}`;

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  function getDurationInSeconds(duration) {
    switch (duration) {
      case "1_week":
        return "604800";
      case "2_week":
        return "1209600";
      case "1_month":
        return "2629746";
      case "2_month":
        return "5259492";
      case "4_month":
        return "10518984";
      case "6_month":
        return "15778476";
      case "1_year":
        return "31556952";
      default:
        return "0";
    }
  }

  const onFinish = values => {
    console.log("Success:", values);
    let plantTreeVal = {};
    plantTreeVal.bounty = parseEther(values.bounty);
    plantTreeVal.duration = getDurationInSeconds(values.duration);
    plantTreeVal.fee_amount = parseEther(values.fee_amount);
    plantTreeVal.frequency = values.frequency;
    plantTreeVal.laple_limit = values.laple_limit;
    plantTreeVal.minwaters = values.minwaters;
    plantTreeVal.payment_size = parseEther(values.payment_size);
    plantTreeVal.start_date = values.start_date.startOf("day").unix();
    console.log(plantTreeVal);
    tx(
      writeContracts.Arboretum.plant(
        plantTreeVal.duration,
        plantTreeVal.frequency,
        plantTreeVal.payment_size,
        plantTreeVal.laple_limit,
        plantTreeVal.fee_amount,
        plantTreeVal.start_date,
        plantTreeVal.minwaters,
        {
          value: plantTreeVal.bounty,
        },
      ),
    );
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  function onChangeDuration(value) {
    console.log(`selected ${value}`);
  }
  const [form] = Form.useForm();
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 64 }}>
        <h2>Plant a Seed {treeCount}</h2>

        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item label="Duration" name="duration">
            <Select
              placeholder="Duration"
              style={{ width: 120 }}
              allowClear
              onChange={e => {
                setNewDuration(e);
              }}
            >
              <Option value="1_week">1 Week</Option>
              <Option value="2_week">2 Week</Option>
              <Option value="1_month">1 Month</Option>
              <Option value="2_month">2 Month</Option>
              <Option value="4_month">4 Month</Option>
              <Option value="6_month">6 Month</Option>
              <Option value="1_year">1 Year</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Start Date" name="start_date">
            <DatePicker format={dateFormat} disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item label="Payment size" name="payment_size">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewPaymentSize(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Lapse Limit" name="laple_limit">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewLapseLimit(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Frequency" name="frequency">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewFrequency(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Fee Amount" name="fee_amount">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewFrequency(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Min Waters" name="minwaters">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewMinWaterers(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Bounty" name="bounty">
            <Space direction="vertical">
              <Input
                onChange={e => {
                  setNewBounty(e.target.value);
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>


          <div style={{margin:8}}>
<Button onClick={()=>{
    let plantTreeVal = {};
    plantTreeVal.bounty = parseEther("0.01");
    plantTreeVal.duration = 1800;
    plantTreeVal.fee_amount = parseEther("0.01");
    plantTreeVal.frequency = 3;
    plantTreeVal.laple_limit = 2;
    plantTreeVal.minwaters = 1;
    plantTreeVal.payment_size = parseEther("0.01");
    plantTreeVal.start_date = Math.round((new Date()).getTime() / 1000) + 120;
    console.log(plantTreeVal);
    tx(
      writeContracts.Arboretum.plant(
        plantTreeVal.duration,
        plantTreeVal.frequency,
        plantTreeVal.payment_size,
        plantTreeVal.laple_limit,
        plantTreeVal.fee_amount,
        plantTreeVal.start_date,
        plantTreeVal.minwaters,
        {
          value: plantTreeVal.bounty,
        },
      ),
    );


  /* this should throw an error about "no fallback nor receive function" until you add it */
}}>Testing Plant</Button>
</div>


        </Form>
      </div>
    </div>
  );
}

module.exports = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_redeemer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_etherAmount",
        "type": "uint256"
      }
    ],
    "name": "FruitRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_waterer",
        "type": "address"
      }
    ],
    "name": "JoinTree",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_startDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_endDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_bounty",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_feeAmt",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_paymentSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_paymentFrequency",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_lapseLimit",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_minWaterers",
        "type": "uint256"
      }
    ],
    "name": "TreePlanted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_waterer",
        "type": "address"
      }
    ],
    "name": "TreeWatered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "_treesJoined",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "feeAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getTimeLeft",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getTimeLeftToStart",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isTree",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "lapsePercent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_waterer",
        "type": "address"
      }
    ],
    "name": "logJoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_redeemer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_etherAmount",
        "type": "uint256"
      }
    ],
    "name": "logRedeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_waterer",
        "type": "address"
      }
    ],
    "name": "logWater",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "freq",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "payment_size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lapse_limit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fee_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "start_date",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "min_waterers",
        "type": "uint256"
      }
    ],
    "name": "plant",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "statsForTree",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treeCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "treeInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bountyPool",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "treeDuration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentSize",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lapseLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "waterersNeeded",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "planted",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "planter",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "waterersCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundsRaised",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finishedCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct TreeInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "trees",
    "outputs": [
      {
        "internalType": "contract Tree",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "treesJoined",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "water",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];
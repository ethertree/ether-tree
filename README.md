# ether-tree

## Ethereum-based lapsed annuity game


A DeFi product based around Lapse Risk. Lapse Risk is expected to have low correlations to other risks in the market and thus provides the savvy investor with more diversification benefits for their portfolio. Investors "water" the tree by regularly depositing ether in a smart contract. If an investor forgets to water the tree then they are locked out of the smart contract. At the end of the duration, the ether in the smart contract is redistributed to the investors. If no one lapses, then there is no return. If many investors lapse, then the return is huge. The project is given a Tree theme. Investors who make it to the end will also be given a "seed" that they can either sell or use to start their own Ether Tree with customisable parameters like: duration, frequency of payments, size of payments, etc.

---

## quickstart


cd ether-tree
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```

🔏 Edit your smart contract in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open http://localhost:3000 to see the app

---
category: "API reference"
---



API Quick Start
===============

RigoBlock TypeScript API to interact with the [RigoBlock Protocol](https://github.com/RigoBlock/rigoblock-monorepo/tree/master/packages/contracts) smart contracts.

Installation
------------

```
npm install --save @rigoblock/api
```

Or with Yarn:

```
yarn add @rigoblock/api
```

Usage
-----

### Initialising the API

```javascript
import Api from '@rigoblock/api'

const api = new Api()
await api.init(web3)
```

_web3_ parameter is optional and defaults to `window.web3`. The API class will then make a call to get the _Network Id_ and set the correct RPC url.

### Instantiating contracts

To instantiate a contract we use the `createAndValidate()` function, which first checks if the contract is deployed on the blockChain, throwing an error if it isn't. The function accepts two parameters: a web3 instance and the contract's address.

Some contracts are already deployed when the API is initialised, their address is saved under a `address` property. To check if a contract is deployed we can use the `isDeployed()` method.

```javascript
api.contract.Authority.isDeployed() // true

const authority = await api.contract.Authority.createAndValidate(
  api.web3,
  api.contract.Authority.address
)
```

### Calling methods

Creating a Vault from the VaultFactory contract

```javascript
import Api from '@rigoblock/api'

const api = new Api()
await api.init()
const vaultFactory = api.contract.VaultFactory.createAndValidate(
  api.web3,
  api.contract.VaultFactory.address
)
const txOptions = { from: '0x1234...' }
const txObject = await vaultFactory.createVault('rocksolidvault', 'VLT')
const gasEstimate = await txObject.estimateGas(txOptions)
const gasPrice = await api.web3.eth.getGasPrice()
const receipt = await txObject.send({
  ...txOptions,
  gas: new BigNumber(gasEstimate).times(1.2).toFixed(0),
  gasPrice
})

const vaultAddress = receipt.events.VaultCreated.returnValues.vault
```

We add some more gas to the estimate as it can be incorrect in case new blocks are added between the estimate and the actual transaction taking place.

### Contract Events

To get past events of a contract, use the `getPastEvents` function:

```javascript
const pastEvents = await api.contract.vaultEventful.getPastEvents('allEvents', {
  fromBlock,
  toBlock
})
```

To create a subscription to a single event, use the relative method and pass it a callback to retrieve the data:

Listening for the `VaultCreated` event

```javascript
await vaultFactory.VaultCreatedEvent(
  {
    fromBlock: 0,
    toBlock: 'latest'
  },
  (err, event) => (err ? console.error(err) : console.log(event))
)
```

If we wish to listen for all events, use the `allEvents` method.

```javascript
await vaultFactory.allEvents(
  {
    fromBlock,
    toBlock
  },
  (err, events) => (err ? console.error(err) : console.log(events))
)
```

Additional Resources
--------------------

For a complete reference of the API, check our [documentation website](https://docs.rigoblock.com).

Additional examples of API usage can be found [here](https://github.com/RigoBlock/rigoblock-monorepo/tree/master/packages/api/examples).

Adding custom methods
---------------------

Custom methods can be added to our contracts using the [Handlebars template](template.handlebars).

Setup
-----

### Available Scripts

```
yarn lint
```

Lints all files.

```
yarn abi-extract
```

Extracts all abis of the deployed contracts, then copies them over to the .tmp folder in json format.

```
yarn abi-gen
```

Generates contract wrappers from the abi JSON files.

```
yarn tsc
```

Compiles all .ts files to Javascript, including map and declaration files into the `dist` folder.

```
yarn tsc:watch
```

Compiles on watch mode

```
yarn build
```

Extracts abis saving them as JSON files, generates wrappers and compiles .ts files into `dist` folder.

```
yarn doc-gen
```

Generates the documentation using [Typedoc](http://typedoc.org/) and further scripts to clean it up.

Contributing
------------

Read our [contribution guidelines](https://github.com/RigoBlock/rigoblock-monorepo/blob/master/CONTRIBUTING.md).

## Index

### External modules

* ["api"](modules/_api_.md)
* ["constants"](modules/_constants_.md)
* ["contracts/baseContract"](modules/_contracts_basecontract_.md)
* ["contracts/contract"](modules/_contracts_contract_.md)
* ["contracts/contractsList"](modules/_contracts_contractslist_.md)
* ["contracts/models/a_ethfinex"](modules/_contracts_models_a_ethfinex_.md)
* ["contracts/models/a_weth"](modules/_contracts_models_a_weth_.md)
* ["contracts/models/authority"](modules/_contracts_models_authority_.md)
* ["contracts/models/distribution"](modules/_contracts_models_distribution_.md)
* ["contracts/models/drago"](modules/_contracts_models_drago_.md)
* ["contracts/models/drago_eventful"](modules/_contracts_models_drago_eventful_.md)
* ["contracts/models/drago_factory"](modules/_contracts_models_drago_factory_.md)
* ["contracts/models/drago_registry"](modules/_contracts_models_drago_registry_.md)
* ["contracts/models/erc20"](modules/_contracts_models_erc20_.md)
* ["contracts/models/exchange_efx"](modules/_contracts_models_exchange_efx_.md)
* ["contracts/models/exchange_v1_fork"](modules/_contracts_models_exchange_v1_fork_.md)
* ["contracts/models/exchanges_authority"](modules/_contracts_models_exchanges_authority_.md)
* ["contracts/models/faucet"](modules/_contracts_models_faucet_.md)
* ["contracts/models/h_get_drago_data"](modules/_contracts_models_h_get_drago_data_.md)
* ["contracts/models/inflation"](modules/_contracts_models_inflation_.md)
* ["contracts/models/migrations"](modules/_contracts_models_migrations_.md)
* ["contracts/models/nav_verifier"](modules/_contracts_models_nav_verifier_.md)
* ["contracts/models/owned"](modules/_contracts_models_owned_.md)
* ["contracts/models/owned_uninitialized"](modules/_contracts_models_owned_uninitialized_.md)
* ["contracts/models/proof_of_performance"](modules/_contracts_models_proof_of_performance_.md)
* ["contracts/models/rigo_token"](modules/_contracts_models_rigo_token_.md)
* ["contracts/models/sig_verifier"](modules/_contracts_models_sig_verifier_.md)
* ["contracts/models/token_transfer_proxy"](modules/_contracts_models_token_transfer_proxy_.md)
* ["contracts/models/unlimited_allowance_token"](modules/_contracts_models_unlimited_allowance_token_.md)
* ["contracts/models/vault"](modules/_contracts_models_vault_.md)
* ["contracts/models/vault_eventful"](modules/_contracts_models_vault_eventful_.md)
* ["contracts/models/vault_factory"](modules/_contracts_models_vault_factory_.md)
* ["contracts/models/weth9"](modules/_contracts_models_weth9_.md)
* ["contracts/models/wrapper_lock"](modules/_contracts_models_wrapper_lock_.md)
* ["contracts/models/wrapper_lock_eth"](modules/_contracts_models_wrapper_lock_eth_.md)
* ["webSocketSubprovider"](modules/_websocketsubprovider_.md)

---


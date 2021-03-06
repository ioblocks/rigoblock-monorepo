import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/exhaustMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/mergeMap'
import { Observable } from 'rxjs/Observable'
import { Scheduler } from 'rxjs/Scheduler'
import { VAULT } from '../../constants/blockchain'
import { from } from 'rxjs/observable/from'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { merge } from 'rxjs/observable/merge'
import { of } from 'rxjs/observable/of'
import { timer } from 'rxjs/observable/timer'
import { zip } from 'rxjs/observable/zip'
import api from '../../api'
import blockChainActions from '../../actions/blockchain-actions'
import contractFactory from '../../contractFactory'

class BlockChainService {
  constructor(api, action$, subject$, ts = Scheduler.async) {
    this.api = api
    this.action$ = action$
    this.subject$ = subject$
    this.scheduler = ts
    this.account = null
    this.accounts = new Set()
  }

  errorListener() {
    return Observable.create(observer => {
      const onError = err => {
        if (err) {
          observer.next(blockChainActions.blockChainError(err.stack))
        }
      }
      this.api.engine.on('error', onError)

      return () => this.api.engine.removeListener('error', onError)
    })
  }

  connectionListener() {
    return timer(0, 1000, this.scheduler)
      .exhaustMap(() =>
        zip(
          fromPromise(this.api.web3.eth.getNodeInfo(), this.scheduler),
          fromPromise(this.api.web3.eth.getAccounts(), this.scheduler)
        )
      )
      .map(([nodeVersion, accounts]) => {
        nodeVersion = nodeVersion
          .split('/')
          .shift()
          .toLowerCase()
        if (!accounts.length && this.account) {
          this.account = null
          this.accounts = new Set()
          return blockChainActions.blockChainLogout()
        }

        // Using != to check if this.account is '' or null
        if (accounts[0] != this.account) {
          this.account = accounts[0]
          this.accounts.add(this.account)
          return blockChainActions.blockChainLogIn({
            provider: nodeVersion,
            account: this.account
          })
        }
      })
      .filter(action => !!action)
  }

  init() {
    const return$ = fromPromise(this.api.init(), this.scheduler)
      .mapTo(blockChainActions.blockChainInit())
      .concat(merge(this.errorListener(), this.connectionListener()))

    return this.wrapError(return$)
  }

  wrapError(action$) {
    return action$.catch(err =>
      of(blockChainActions.blockChainError(err.stack))
    )
  }

  fetchVaultEvents(fromBlock, toBlock = 'latest') {
    fromBlock = fromBlock || 0
    const allVaultEvents = fromPromise(
      contractFactory.getInstance(
        'VaultEventful',
        api.contract.VaultEventful.address
      ),
      this.scheduler
    )
      .mergeMap(vaultEventful =>
        fromPromise(
          vaultEventful.getPastEvents('allEvents', {
            fromBlock,
            toBlock
          })
        )
      )
      .mergeMap(events => from(events))
    const filteredBlocks = this._filterBlocksByAccounts(VAULT, allVaultEvents)
    return this.wrapError(
      filteredBlocks.concat(of(blockChainActions.vaultFetchCompleted()))
    )
  }

  watchVaultEvents(fromBlock, toBlock = 'latest') {
    fromBlock = fromBlock || 0
    const allVaultEvents = fromPromise(
      contractFactory.getInstance(
        'VaultEventful',
        api.contract.VaultEventful.address
      ),
      this.scheduler
    ).mergeMap(vaultEventful => {
      return Observable.create(observer => {
        const events = vaultEventful.allEvents(
          {
            fromBlock,
            toBlock
          },
          (err, events) => (err ? observer.error(err) : observer.next(events))
        )
        return () => events.unsubscribe()
      })
    })
    return this.wrapError(this._filterBlocksByAccounts(VAULT, allVaultEvents))
  }

  _filterBlocksByAccounts(label, obs) {
    return obs
      .map(block => {
        const account = Object.values(block.returnValues).reduce(
          (accountInvolved, blockAcc) =>
            this.accounts.has(blockAcc) ? blockAcc : accountInvolved,
          null
        )
        return account && { ...block, account }
      })
      .filter(block => !!block)
      .mergeMap(block => {
        return fromPromise(
          this.api.web3.eth.getBlock(block.blockNumber),
          this.scheduler
        ).map(({ timestamp }) => ({
          ...block,
          timestamp: timestamp * 1000
        }))
      })
      .map(decoratedBlock => {
        const { account, ...block } = decoratedBlock
        return blockChainActions.registerBlock({ account, label, block })
      })
  }
}

let blockChainServiceInstance

BlockChainService.createInstance = function createInstance(...args) {
  blockChainServiceInstance = new BlockChainService(...args)
  return blockChainServiceInstance
}
BlockChainService.getInstance = function getInstance() {
  return blockChainServiceInstance
}

export default BlockChainService

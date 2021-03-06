import { TestScheduler } from 'rxjs'
import { VAULT } from '../../constants/blockchain'
import { _throw } from 'rxjs/observable/throw'
import { of } from 'rxjs/observable/of'
import blockChainActions from '../../actions/blockchain-actions'

describe('blockChain services function', () => {
  const testError = new Error('test error')
  const nodeVersion = 'MetaMask/v4.6.1'
  const owner = '0x242B2Dd21e7E1a2b2516d0A3a06b58e2D9BF9196'
  const blocks = [
    {
      returnValues: {
        vault: '0x123',
        from: owner,
        to: '0x005',
        amount: '1',
        revenue: '1'
      },
      event: 'BuyVault'
    },
    {
      returnValues: {
        vault: '0x123',
        from: '0x242b2dd21e7e1a2b2516d0a3a06b58e2d9bf9192',
        to: '0x005',
        amount: '1',
        revenue: '1'
      },
      event: 'SellVault'
    }
  ]

  let BlockChainService
  let fromPromiseSpy
  let apiMock
  let contractFactoryMock

  beforeEach(() => {
    jest.resetModules()
    fromPromiseSpy = jest.fn()
    contractFactoryMock = {
      getInstance: jest.fn()
    }
    apiMock = {
      init: () => Promise.resolve(),
      engine: {
        on: (x, cb) => cb(),
        removeListener: () => {}
      },
      web3: {
        eth: {
          getNodeInfo: jest.fn(),
          getAccounts: jest.fn(),
          getBlock: jest.fn()
        }
      },
      contract: {
        VaultEventful: {
          address: '0x0'
        }
      }
    }
    jest.doMock('rxjs/observable/fromPromise', () => ({
      fromPromise: fromPromiseSpy
    }))
    jest.doMock('../../contractFactory', () => contractFactoryMock)
    jest.doMock('../../api', () => apiMock)
    BlockChainService = require('./BlockChainService').default
  })
  describe('main observable flow', () => {
    beforeEach(() => {
      fromPromiseSpy.mockReturnValueOnce(
        of(['just something to trigger api.init()'])
      )
    })
    it('returns a blockchain init action', () => {
      fromPromiseSpy
        .mockReturnValueOnce(of(nodeVersion))
        .mockReturnValueOnce(of([]))

      const expectedValues = {
        b: blockChainActions.blockChainInit()
      }

      const expectedMarble = 'b'
      const ts = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected)
      })

      const blockChainService = new BlockChainService(apiMock, null, null, ts)
      const outputAction = blockChainService.init()

      ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

      ts.flush()
    })
    describe('connection listener', () => {
      it('gets called every 1000 milliseconds', () => {
        const address1 = 'address1'
        const address2 = 'address2'

        fromPromiseSpy
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(of([address1]))
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(of([address2]))
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(of([address1]))

        const expectedValues = {
          a: blockChainActions.blockChainInit(),
          b: blockChainActions.blockChainLogIn({
            provider: 'metamask',
            account: address1
          }),
          c: blockChainActions.blockChainLogIn({
            provider: 'metamask',
            account: address2
          })
        }

        const expectedMarble =
          '(ab)' + addTimeFrames(96, 'c') + addTimeFrames(99, 'b')

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)
        const outputAction = blockChainService.init()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

        ts.maxFrames = 2000

        ts.flush()
      })

      it('sends blockChainError action if web3 getAvailableAddressesAsync fails', () => {
        fromPromiseSpy
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(_throw(testError))

        const expectedValues = {
          a: blockChainActions.blockChainInit(),
          b: blockChainActions.blockChainError(testError.stack)
        }

        const expectedMarble = '(ab|)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)
        const outputAction = blockChainService.init()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

        ts.flush()
      })

      it('sends blockChainLogin action if web3 retrieves accounts list', () => {
        fromPromiseSpy
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(of([owner]))

        const expectedValues = {
          a: blockChainActions.blockChainInit(),
          b: blockChainActions.blockChainLogIn({
            provider: 'metamask',
            account: owner
          })
        }

        const expectedMarble = '(ab)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)
        const outputAction = blockChainService.init()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

        ts.flush()
      })

      it("sends blockChainLogout action if web3 doesn't retrieve accounts list", () => {
        fromPromiseSpy
          .mockReturnValueOnce(of(nodeVersion))
          .mockReturnValueOnce(of([]))

        const expectedValues = {
          a: blockChainActions.blockChainInit(),
          b: blockChainActions.blockChainLogout()
        }

        const expectedMarble = '(ab)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)

        blockChainService.account = owner
        blockChainService.accounts.add(owner)

        const outputAction = blockChainService.init()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)

        ts.flush()
      })
    })
    describe('error listener', () => {
      it('listens for connectivity issues', () => {
        fromPromiseSpy.mockReturnValueOnce(of('')).mockReturnValueOnce(of([]))

        const apiWithError = {
          ...apiMock,
          engine: {
            on: (_, cb) => cb(testError),
            removeListener: () => {}
          }
        }

        const expectedValues = {
          a: blockChainActions.blockChainInit(),
          b: blockChainActions.blockChainError(testError.stack)
        }

        const expectedMarble = '(ab)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(
          apiWithError,
          null,
          null,
          ts
        )
        const outputAction = blockChainService.init()
        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)
        ts.flush()
      })
    })
  })
  describe('utility functions', () => {
    const unsubscribeMock = jest.fn()
    const vaultEventful = {
      getPastEvents: () => blocks,
      allEvents: (opt, cb) => {
        cb(null, blocks[0])
        return {
          unsubscribe: unsubscribeMock
        }
      }
    }
    describe('fetch vault events', () => {
      it('fetches blocks, filters them by account and saves them to state with a timestamp', () => {
        const blockWithTimestamp = { ...blocks[0], timestamp: 1528811195000 }
        fromPromiseSpy.mockReturnValueOnce(of(vaultEventful))
        fromPromiseSpy.mockReturnValueOnce(of(blocks))
        fromPromiseSpy.mockReturnValueOnce(of({ timestamp: '1528811195' }))
        const expectedValues = {
          a: blockChainActions.registerBlock({
            account: owner,
            label: VAULT,
            block: blockWithTimestamp
          }),
          b: blockChainActions.vaultFetchCompleted()
        }

        const expectedMarble = '(ab|)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)

        blockChainService.account = owner
        blockChainService.accounts.add(owner)

        const outputAction = blockChainService.fetchVaultEvents()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)
        ts.flush()
      })
    })
    describe('watch vault events', () => {
      it('watches for new blocks, filters them by account and saves them to state with a timestamp', () => {
        const blockWithTimestamp = { ...blocks[0], timestamp: 1528811195000 }
        fromPromiseSpy.mockReturnValueOnce(of(vaultEventful))
        fromPromiseSpy.mockReturnValueOnce(of({ timestamp: '1528811195' }))
        const expectedValues = {
          a: blockChainActions.registerBlock({
            account: owner,
            label: VAULT,
            block: blockWithTimestamp
          })
        }

        const expectedMarble = 'a'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)

        blockChainService.account = owner
        blockChainService.accounts.add(owner)

        const outputAction = blockChainService.watchVaultEvents()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)
        ts.flush()

        const subscription = outputAction.subscribe()
        subscription.unsubscribe()
        expect(unsubscribeMock).toHaveBeenCalled()
      })
      it('emits blockChainError if there is an error during watch', () => {
        const fetchError = new Error('error during watch')
        const errorVaultEventful = {
          ...vaultEventful,
          allEvents: (opt, cb) => {
            cb(fetchError, null)
            return {
              unsubscribe: unsubscribeMock
            }
          }
        }
        fromPromiseSpy.mockReturnValueOnce(of(errorVaultEventful))
        const expectedValues = {
          a: blockChainActions.blockChainError(fetchError.stack)
        }

        const expectedMarble = '(a|)'

        const ts = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected)
        })

        const blockChainService = new BlockChainService(apiMock, null, null, ts)

        const outputAction = blockChainService.watchVaultEvents()

        ts.expectObservable(outputAction).toBe(expectedMarble, expectedValues)
        ts.flush()
        expect(unsubscribeMock).toHaveBeenCalled()
      })
    })
    describe('createInstance/getInstance functions', () => {
      it('creates an instance of the class / retrieves class instance', () => {
        const blockChainServiceInstance = BlockChainService.createInstance(
          apiMock,
          null,
          null,
          null
        )
        expect(BlockChainService.getInstance()).toBe(blockChainServiceInstance)
      })
    })
  })
})

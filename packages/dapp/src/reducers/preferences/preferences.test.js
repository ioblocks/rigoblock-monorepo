import CONSTANTS from '../../constants/user'
import blockChainActions from '../../actions/blockchain-actions'
import preferencesReducer from './preferences'
import userActions from '../../actions/user-actions'

const initialState = {
  timezone: 'GMT +02:00',
  type: CONSTANTS.INVESTOR,
  currentAccount: null,
  provider: null
}
const account = '0x242b2dd21e7e1a2b2516d0a3a06b58e2d9bf9196'
const origin = 'metamask'

describe('user reducer', () => {
  const preferencesTest = reducerTester(preferencesReducer)

  it('returns the initial state', () => {
    preferencesTest(initialState, {}, initialState)
  })

  it("updates user's timezone", () => {
    preferencesTest(
      undefined,
      userActions.changePreferences({
        timezone: 'GMT +05:45'
      }),
      {
        timezone: 'GMT +05:45',
        type: CONSTANTS.INVESTOR,
        currentAccount: null,
        provider: null
      }
    )
  })
  it('saves the default account number to the state', () => {
    preferencesTest(
      undefined,
      blockChainActions.blockChainLogIn(origin, account),
      {
        timezone: 'GMT +02:00',
        type: CONSTANTS.INVESTOR,
        currentAccount: account,
        provider: origin
      }
    )
  })

  it('clears account number on logout', () => {
    preferencesTest(
      {
        timezone: 'GMT +02:00',
        type: CONSTANTS.INVESTOR,
        currentAccount: account,
        provider: origin
      },
      blockChainActions.blockChainLogout(),
      initialState
    )
  })
})
import { actionTypes } from '../../../constants/action-types'
import u from 'updeep'

// This is a sub-reducer of blockchain, so it shouldn't have initialState
function vaultReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_RAW_VAULT:
      const blockNumber = action.payload.block.blockNumber
      let lastBlock = state.accounts[action.account].lastBlock
      lastBlock =
        !lastBlock || lastBlock < blockNumber ? blockNumber : lastBlock
      return u(
        {
          accounts: {
            [action.account]: {
              vaultBlocks: {
                [action.payload.block.blockNumber]: action.payload.block
              },
              lastBlock: lastBlock
            }
          }
        },
        state
      )
    case actionTypes.ADD_VAULT:
      return u(
        {
          accounts: {
            [action.account]: { vaults: action.payload }
          }
        },
        state
      )
    default:
      return state
  }
}

export default vaultReducer
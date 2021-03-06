import { createAction } from 'redux-act'

export default {
  blockChainInit: createAction('blockChain initiated!'),
  blockChainError: createAction('blockChain error!'),
  blockChainLogIn: createAction('user login'),
  blockChainLogout: createAction('user logout'),
  transactionInProgress: createAction('transaction in progress'),
  transactionCompleted: createAction('transaction completed'),
  transactionFailed: createAction('transaction failed'),
  registerBlock: createAction('event block registered'),
  vaultFetchCompleted: createAction('vault fetch completed'),
  updateAccountBalance: createAction('updating accounts balance'),
  updateTotalAccountBalance: createAction('updating total accounts balance')
}

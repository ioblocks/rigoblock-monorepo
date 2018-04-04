import React from 'react'
import ReactDOM from 'react-dom'
import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'
import history from './store/history'
import App from './pages/App'
import Vault from './pages/Vault'
import './images/favicon.ico'
import './index.scss'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" render={() => <App title={'RigoBlock'} />} />
          <Route exact path="/vault" render={() => <Vault />} />
        </div>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()

if (module.hot) {
  module.hot.accept()
}
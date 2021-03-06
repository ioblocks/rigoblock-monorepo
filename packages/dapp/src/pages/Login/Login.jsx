import './Login.scss'
import BaseTemplate from '../../components/templates/BaseTemplate'
import Link, { LINK_SIZES } from '../../components/atoms/Link'
import React, { Component } from 'react'

class Login extends Component {
  render() {
    return (
      <BaseTemplate>
        <div className="login-content">
          <h1>Hello there!</h1>
          <p>
            Rigoblock is a decentralized app that runs on Ethereum Blockchain.
            To start using it, just follow these 3 simple steps:
          </p>
          <h3>1. Install a decentralized wallet</h3>
          <p>We suggest to use Metamask or Parity.</p>
          <a href={'https://metamask.io/'}>Metamask</a>
          <br />
          <a href={'https://www.parity.io/'}>Parity UI</a>
          <p>Go get one and come back soon (~˘▾˘)~</p>
          <h3>2. Transfer some funds to your decentralized wallet</h3>
          <p>As you would do with a standard ETH wallet.</p>
          <h3>3. Start investing with RigoBlock</h3>
          <p>
            Now you are ready to deposit and invest with on Rigoblock ( ﾟヮﾟ)!
          </p>
          <div className="line-break" />
          <h3>Need a hand?</h3>
          <Link to={'#'} size={LINK_SIZES.SMALL}>
            We are here to help!
          </Link>
        </div>
      </BaseTemplate>
    )
  }
}

export default Login

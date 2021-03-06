import { AEthfinex } from './models/a_ethfinex'
import { ATotlePrimary } from './models/a_totle_primary'
import { AWeth } from './models/a_weth'
import { AbiEncoder } from './models/abi_encoder'
import { AffiliateRegistry } from './models/affiliate_registry'
import { Authority } from './models/authority'
import { Distribution } from './models/distribution'
import { Drago } from './models/drago'
import { DragoEventful } from './models/drago_eventful'
import { DragoFactory } from './models/drago_factory'
import { DragoRegistry } from './models/drago_registry'
import { ERC20 } from './models/erc20'
import { Erc20Proxy } from './models/erc20_proxy'
import { ErrorReporter } from './models/error_reporter'
import { Exchange } from './models/exchange'
import { ExchangeEfx } from './models/exchange_efx'
import { ExchangeV1Fork } from './models/exchange_v1_fork'
import { ExchangesAuthority } from './models/exchanges_authority'
import { Faucet } from './models/faucet'
import { HGetDragoData } from './models/h_get_drago_data'
import { HandlerMock } from './models/handler_mock'
import { Inflation } from './models/inflation'
import { Migrations } from './models/migrations'
import { NavVerifier } from './models/nav_verifier'
import { Owned } from './models/owned'
import { OwnedUninitialized } from './models/owned_uninitialized'
import { ProofOfPerformance } from './models/proof_of_performance'
import { RigoToken } from './models/rigo_token'
import { SigVerifier } from './models/sig_verifier'
import { TokenTransferProxy } from './models/token_transfer_proxy'
import { TotlePrimary } from './models/totle_primary'
import { UnlimitedAllowanceToken } from './models/unlimited_allowance_token'
import { Vault } from './models/vault'
import { VaultEventful } from './models/vault_eventful'
import { VaultFactory } from './models/vault_factory'
import { WETH9 } from './models/weth9'
import { WrapperLock } from './models/wrapper_lock'
import { WrapperLockEth } from './models/wrapper_lock_eth'
import { ZeroExExchangeHandler } from './models/zero_ex_exchange_handler'

// typeof Authority & Authority = needed to expose all static methods and
// instance methods of the Authority contract

export abstract class ContractsList {
  AEthfinex: typeof AEthfinex & AEthfinex
  ATotlePrimary: typeof ATotlePrimary & ATotlePrimary
  AWeth: typeof AWeth & AWeth
  AbiEncoder: typeof AbiEncoder & AbiEncoder
  AffiliateRegistry: typeof AffiliateRegistry & AffiliateRegistry
  Authority: typeof Authority & Authority
  Distribution: typeof Distribution & Distribution
  Drago: typeof Drago & Drago
  DragoEventful: typeof DragoEventful & DragoEventful
  DragoFactory: typeof DragoFactory & DragoFactory
  DragoRegistry: typeof DragoRegistry & DragoRegistry
  ERC20: typeof ERC20 & ERC20
  Erc20Proxy: typeof Erc20Proxy & Erc20Proxy
  ErrorReporter: typeof ErrorReporter & ErrorReporter
  Exchange: typeof Exchange & Exchange
  ExchangeEfx: typeof ExchangeEfx & ExchangeEfx
  ExchangeV1Fork: typeof ExchangeV1Fork & ExchangeV1Fork
  ExchangesAuthority: typeof ExchangesAuthority & ExchangesAuthority
  Faucet: typeof Faucet & Faucet
  HGetDragoData: typeof HGetDragoData & HGetDragoData
  HandlerMock: typeof HandlerMock & HandlerMock
  Inflation: typeof Inflation & Inflation
  Migrations: typeof Migrations & Migrations
  NavVerifier: typeof NavVerifier & NavVerifier
  Owned: typeof Owned & Owned
  OwnedUninitialized: typeof OwnedUninitialized & OwnedUninitialized
  ProofOfPerformance: typeof ProofOfPerformance & ProofOfPerformance
  RigoToken: typeof RigoToken & RigoToken
  SigVerifier: typeof SigVerifier & SigVerifier
  TokenTransferProxy: typeof TokenTransferProxy & TokenTransferProxy
  TotlePrimary: typeof TotlePrimary & TotlePrimary
  UnlimitedAllowanceToken: typeof UnlimitedAllowanceToken & UnlimitedAllowanceToken
  Vault: typeof Vault & Vault
  VaultEventful: typeof VaultEventful & VaultEventful
  VaultFactory: typeof VaultFactory & VaultFactory
  WETH9: typeof WETH9 & WETH9
  WrapperLock: typeof WrapperLock & WrapperLock
  WrapperLockEth: typeof WrapperLockEth & WrapperLockEth
  ZeroExExchangeHandler: typeof ZeroExExchangeHandler & ZeroExExchangeHandler
}

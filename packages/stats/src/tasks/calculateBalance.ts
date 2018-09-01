import { NETWORKS } from '../constants'
import protocol from '@rigoblock/protocol'
import redis from '../redis'
import Web3 from 'web3'
import statsD from '../statsd'
import web3ErrorWrapper from './web3ErrorWrapper'

const task = async (job, web3: Web3) => {
  const { symbol, address, key, network, poolType } = job.data

  const contractsMap = await protocol(NETWORKS.KOVAN)
  const erc20Abi = contractsMap.ERC20.abi
  const contract = new web3.eth.Contract(erc20Abi, address)
  const pools = await redis.hgetall(`${key}:${network}`)

  if (!Object.keys(pools).length) {
    return true
  }

  const balances = await Promise.all(
    Object.keys(pools).map(async address => {
      const balance = await contract.methods.balanceOf(address).call()
      return {
        address,
        balance
      }
    })
  )

  const gaugePromises = balances.map(
    pool =>
      new Promise((resolve, reject) => {
        statsD.gauge(
          `${poolType}.${pool.address}.${network}.balance.${symbol}`,
          pool.balance,
          (error, bytes) => (error ? reject(error) : resolve(bytes))
        )
      })
  )

  return Promise.all(gaugePromises)
}

export default web3ErrorWrapper(task)
import { Address, dataSource } from "@graphprotocol/graph-ts"
import { Created, Executed, Canceled } from "../generated/CoreBalance/Core"
import { IERC20 } from '../generated/CoreBalance/IERC20'
import {
  getBalanceHistory
} from "../utils/generators"

// token addresses
let DAIr = Address.fromString('0x6b175474e89094c44da98b954eedeac495271d0f')
let DAIm = Address.fromString('0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658')
let USDCr = Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
let USDCm = Address.fromString('0x7d66cde53cc0a169cae32712fc48934e610aef14')
let WETHr = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
let WETHm = Address.fromString('0xc778417e063141139fce010982780140aa0cd5ab')

export function handleCreated(event: Created): void {
  let DAItoken = IERC20.bind(DAIm)
  let USDCtoken = IERC20.bind(USDCm)
  let WETHtoken = IERC20.bind(WETHm)
  if (dataSource.network() === 'rinkeby') {
    DAItoken = IERC20.bind(DAIr)
    USDCtoken = IERC20.bind(USDCr)
    WETHtoken = IERC20.bind(WETHr)
  }

  let balanceHistory = getBalanceHistory(event.transaction.hash, event.transactionLogIndex)
  balanceHistory.DAI = DAItoken.balanceOf(dataSource.address())
  balanceHistory.USDC = USDCtoken.balanceOf(dataSource.address())
  balanceHistory.WETH = WETHtoken.balanceOf(dataSource.address())
  balanceHistory.timestamp = event.block.timestamp
}

export function handleExecuted(event: Executed): void {
  let DAItoken = IERC20.bind(DAIm)
  let USDCtoken = IERC20.bind(USDCm)
  let WETHtoken = IERC20.bind(WETHm)
  if (dataSource.network() === 'rinkeby') {
    DAItoken = IERC20.bind(DAIr)
    USDCtoken = IERC20.bind(USDCr)
    WETHtoken = IERC20.bind(WETHr)
  }

  let balanceHistory = getBalanceHistory(event.transaction.hash, event.transactionLogIndex)
  balanceHistory.DAI = DAItoken.balanceOf(dataSource.address())
  balanceHistory.USDC = USDCtoken.balanceOf(dataSource.address())
  balanceHistory.WETH = WETHtoken.balanceOf(dataSource.address())
  balanceHistory.timestamp = event.block.timestamp
}

export function handleCanceled(event: Canceled): void {
  let DAItoken = IERC20.bind(DAIm)
  let USDCtoken = IERC20.bind(USDCm)
  let WETHtoken = IERC20.bind(WETHm)
  if (dataSource.network() === 'rinkeby') {
    DAItoken = IERC20.bind(DAIr)
    USDCtoken = IERC20.bind(USDCr)
    WETHtoken = IERC20.bind(WETHr)
  }

  let balanceHistory = getBalanceHistory(event.transaction.hash, event.transactionLogIndex)
  balanceHistory.DAI = DAItoken.balanceOf(dataSource.address())
  balanceHistory.USDC = USDCtoken.balanceOf(dataSource.address())
  balanceHistory.WETH = WETHtoken.balanceOf(dataSource.address())
  balanceHistory.timestamp = event.block.timestamp
}

import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"

import {
  Position,
  User,
  Ticker,
  TokenId,
  FixedRateCompoundDeposit,
  Tx
} from "../generated/schema"

import { zeroAddress, zeroBI } from './converters'

function getPositionId(address: Address, tokenId: BigInt): string {
  return address.toHex() + tokenId.toString()
}

function getFixedRateCompoundDepositId(address: Address, depositId: BigInt): string {
  return address.toHex() + depositId.toString()
}

export const getTx = (txHash: Bytes): Tx => {
  let txId = txHash.toHex()

  let tx = Tx.load(txId)

  if (tx === null) {
    tx = new Tx(txId)

    tx.ticker = ''
    
    tx.save()
  }

  return tx as Tx
}

export const getUser = (address: Address): User => {
  let userId = address.toHex()

  let user = User.load(userId)

  if (user === null) {
    user = new User(userId)
    user.save()
  }

  return user as User
}

export const getTokenId = (id: BigInt): TokenId => {
  let tokenIdString = id.toString()

  let tokenId = TokenId.load(tokenIdString)

  if (tokenId === null) {
    tokenId = new TokenId(tokenIdString)

    tokenId.ticker = ''

    tokenId.save()
  }

  return tokenId as TokenId
}

export const getTicker = (hash: Bytes): Ticker => {
  let tickerId = hash.toHex()

  let ticker = Ticker.load(tickerId)

  if (ticker === null) {
    ticker = new Ticker(tickerId)
    ticker.margin = zeroBI()
    ticker.endTime = zeroBI()
    ticker.params = []
    ticker.oracleId = zeroAddress()
    ticker.token = zeroAddress()
    ticker.syntheticId = zeroAddress()

    ticker.longTokenId = ''
    ticker.shortTokenId = ''

    ticker.tx = ''
    ticker.save()
  }

  return ticker as Ticker
}

export const getPosition = (userAddress: Address, tokenId: BigInt): Position => {
  let positionId = getPositionId(userAddress, tokenId)

  let position = Position.load(positionId)

  if (position === null) {
    position = new Position(positionId)

    let user = getUser(userAddress)
    position.user = user.id

    let tokenIdEntity = getTokenId(tokenId)
    position.tokenId = tokenIdEntity.id

    position.amount = zeroBI()

    position.save()
  }

  return position as Position
}

export const getFixedRateCompoundDeposit = (userAddress: Address, depositId: BigInt): FixedRateCompoundDeposit => {
  let fixedRateCompoundDepositId = getFixedRateCompoundDepositId(userAddress, depositId)

  let fixedRateCompoundDeposit = FixedRateCompoundDeposit.load(fixedRateCompoundDepositId)

  if (fixedRateCompoundDeposit === null) {
    fixedRateCompoundDeposit = new FixedRateCompoundDeposit(fixedRateCompoundDepositId)

    let user = getUser(userAddress)
    fixedRateCompoundDeposit.user = user.id

    fixedRateCompoundDeposit.depositId = depositId
    fixedRateCompoundDeposit.cToken = zeroAddress()
    fixedRateCompoundDeposit.cTokenAmount = zeroBI()
    fixedRateCompoundDeposit.tx = ''

    fixedRateCompoundDeposit.save()
  }

  return fixedRateCompoundDeposit as FixedRateCompoundDeposit
}

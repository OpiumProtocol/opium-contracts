import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"

import { Position, User, Ticker, TokenId } from "../generated/schema"

function getPositionId(address: Address, tokenId: BigInt): string {
  return address.toString() + tokenId.toString()
}

export const getUser = (address: Address): User => {
  let userId = address.toString()

  let user = User.load(userId)

  if (user === null) {
    user = new User(userId)
    user.save()
  }

  return user as User
}

export const getPosition = (userAddress: Address, tokenId: BigInt): Position => {
  let positionId = getPositionId(userAddress, tokenId)

  let position = Position.load(positionId)

  if (position === null) {
    position = new Position(positionId)

    let user = getUser(userAddress)
    position.user = user.id

    position.save()
  }

  return position as Position
}

export const getTicker = (hash: Bytes): Ticker => {
  let tickerId = hash.toHex()

  let ticker = Ticker.load(tickerId)

  if (ticker === null) {
    ticker = new Ticker(tickerId)
    ticker.save()
  }

  return ticker as Ticker
}

export const getTokenId = (id: BigInt): TokenId => {
  let tokenIdString = id.toString()

  let tokenId = TokenId.load(tokenIdString)

  if (tokenId === null) {
    tokenId = new TokenId(tokenIdString)
    tokenId.save()
  }

  return tokenId as TokenId
}

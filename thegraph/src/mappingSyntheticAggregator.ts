import { Address, log } from "@graphprotocol/graph-ts"

import { LibPosition } from "../generated/SyntheticAggregator/LibPosition"
import { Create } from "../generated/SyntheticAggregator/SyntheticAggregator"

import {
  getTokenId,
  getTicker
} from "../utils/generators"

const LibPositionAddress = '0x56c54b408c44B12f6c9219C9c73Fcda4E783FC20'

export function handleCreate(event: Create): void {
  let libPosition = LibPosition.bind(Address.fromString(LibPositionAddress))

  let ticker = getTicker(event.params.derivativeHash)
  
  ticker.margin = event.params.derivative.margin
  ticker.endTime = event.params.derivative.endTime
  ticker.params = event.params.derivative.params
  ticker.oracleId = event.params.derivative.oracleId
  ticker.token = event.params.derivative.token
  ticker.syntheticId = event.params.derivative.syntheticId

  // let longTokenIdBigInt = libPosition.getLongTokenId(event.params.derivativeHash)
  // let longTokenId = getTokenId(longTokenIdBigInt)
  // ticker.longTokenId = longTokenId.id

  // let shortTokenIdBigInt = libPosition.getShortTokenId(event.params.derivativeHash)
  // let shortTokenId = getTokenId(shortTokenIdBigInt)
  // ticker.shortTokenId = shortTokenId.id

  // log.error('Long token id = {}', [longTokenIdBigInt.toString()])
  // log.error('Short token id = {}', [shortTokenIdBigInt.toString()])

  ticker.save()
}

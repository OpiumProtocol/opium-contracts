import { Address } from "@graphprotocol/graph-ts"

import { LibPosition } from "../generated/SyntheticAggregator/LibPosition"
import { Create } from "../generated/SyntheticAggregator/SyntheticAggregator"
import { Ticker } from "../generated/schema"

import { getTokenId, getTicker } from "../utils/generators"

const LibPositionAddress = '0x56c54b408c44B12f6c9219C9c73Fcda4E783FC20'

export function handleCreate(event: Create): void {
  let libPosition = LibPosition.bind(Address.fromString(LibPositionAddress))

  let ticker = getTicker(event.params.derivativeHash)
  
  ticker.margin = event.params.derivative.margin
  ticker.endTime = event.params.derivative.endTime
  ticker.params = event.params.derivative.params
  ticker.oracleId = event.params.derivative.oracleId.toHex()
  ticker.token = event.params.derivative.token.toHex()
  ticker.syntheticId = event.params.derivative.syntheticId.toHex()

  let longTokenId = getTokenId(libPosition.getLongTokenId(event.params.derivativeHash))
  ticker.longTokenId = longTokenId.id

  let shortTokenId = getTokenId(libPosition.getShortTokenId(event.params.derivativeHash))
  ticker.shortTokenId = shortTokenId.id

  ticker.save()
}

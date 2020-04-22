import { Address } from "@graphprotocol/graph-ts"

import { LibPosition } from "../generated/SyntheticAggregator/LibPosition"
import { Create } from "../generated/SyntheticAggregator/SyntheticAggregator"

import {
  getTokenId,
  getTicker,
  getTx
} from "../utils/generators"

let LibPositionAddressBySyntheticAggregatorAddress = new Map<Address,Address>()
LibPositionAddressBySyntheticAggregatorAddress.set(Address.fromString('0x3a943c50bcde3e357916ce6e109626213fd36105'), Address.fromString('0x56c54b408c44B12f6c9219C9c73Fcda4E783FC20'))
LibPositionAddressBySyntheticAggregatorAddress.set(Address.fromString('0x8fb660ab5542d752047312443742f209c88e2170'), Address.fromString('0xecfb28f107de2bFB325E339293dE3A01C1CfFA74'))

export function handleCreate(event: Create): void {
  // Ticker
  let libPosition = LibPosition.bind(LibPositionAddressBySyntheticAggregatorAddress.get(event.address))

  let ticker = getTicker(event.params.derivativeHash)
  
  ticker.margin = event.params.derivative.margin
  ticker.endTime = event.params.derivative.endTime
  ticker.params = event.params.derivative.params
  ticker.oracleId = event.params.derivative.oracleId
  ticker.token = event.params.derivative.token
  ticker.syntheticId = event.params.derivative.syntheticId

  let longTokenIdBigInt = libPosition.getLongTokenId(event.params.derivativeHash)

  let longTokenId = getTokenId(longTokenIdBigInt)
  longTokenId.ticker = ticker.id
  longTokenId.save()
  ticker.longTokenId = longTokenId.id

  let shortTokenIdBigInt = libPosition.getShortTokenId(event.params.derivativeHash)

  let shortTokenId = getTokenId(shortTokenIdBigInt)
  shortTokenId.ticker = ticker.id
  shortTokenId.save()
  ticker.shortTokenId = shortTokenId.id

  // Tx
  let txHash = event.transaction.hash

  let tx = getTx(txHash)
  tx.ticker = ticker.id
  tx.save()

  ticker.tx = tx.id

  ticker.save()
}

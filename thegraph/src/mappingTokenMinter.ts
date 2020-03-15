import { Address, BigInt } from "@graphprotocol/graph-ts"

import { TransferWithQuantity } from "../generated/TokenMinter/TokenMinter"
import { Position } from "../generated/schema"

import { getPosition } from "../utils/generators"

let zeroAddress = Address.fromString('0x0000000000000000000000000000000000000000')

export function handleTransferWithQuantity(event: TransferWithQuantity): void {
  let from = event.params.from
  let to = event.params.to
  let tokenId = event.params.tokenId
  let quantity = event.params.quantity
  
  if (from !== zeroAddress) {
    let fromPosition = getPosition(from, tokenId)
    fromPosition.amount = fromPosition.amount.minus(quantity)
    fromPosition.save()
  }

  if (to != zeroAddress) {
    let toPosition = getPosition(to, tokenId)
    toPosition.amount = toPosition.amount.plus(quantity)
    toPosition.save()
  }
}

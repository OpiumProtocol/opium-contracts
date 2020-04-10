import { Deposit, Withdraw, EmergencyWithdraw } from "../generated/CompoundSupplyAggregator/CompoundSupplyAggregator"

import { getFixedRateCompoundDeposit, getTx } from "../utils/generators"

/**
 * When new deposit is created
 * @param {Deposit} event Deposit event
 */
export function handleDeposit(event: Deposit): void {
  let userAddress = event.params.sender
  let depositId = event.params.id
  let cToken = event.params.cToken
  let cTokenAmount = event.params.cTokenAmount
  let txHash = event.transaction.hash
  
  let fixedRateCompoundDeposit = getFixedRateCompoundDeposit(userAddress, depositId)
  fixedRateCompoundDeposit.cToken = cToken
  fixedRateCompoundDeposit.cTokenAmount = cTokenAmount
  
  let tx = getTx(txHash)
  fixedRateCompoundDeposit.tx = tx.id

  fixedRateCompoundDeposit.save()
}

export function handleWithdraw(event: Withdraw): void {
  let userAddress = event.params.sender
  let depositId = event.params.id
  let cTokenAmount = event.params.cTokenAmount

  let fixedRateCompoundDeposit = getFixedRateCompoundDeposit(userAddress, depositId)

  fixedRateCompoundDeposit.cTokenAmount = fixedRateCompoundDeposit.cTokenAmount.minus(cTokenAmount)

  fixedRateCompoundDeposit.save()
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  let userAddress = event.params.sender
  let depositId = event.params.id
  let cTokenAmount = event.params.cTokenAmount

  let fixedRateCompoundDeposit = getFixedRateCompoundDeposit(userAddress, depositId)

  fixedRateCompoundDeposit.cTokenAmount = fixedRateCompoundDeposit.cTokenAmount.minus(cTokenAmount)

  fixedRateCompoundDeposit.save()
}

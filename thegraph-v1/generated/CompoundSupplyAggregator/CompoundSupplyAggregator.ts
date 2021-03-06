// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Committed extends ethereum.Event {
  get params(): Committed__Params {
    return new Committed__Params(this);
  }
}

export class Committed__Params {
  _event: Committed;

  constructor(event: Committed) {
    this._event = event;
  }

  get timelock(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Committed1 extends ethereum.Event {
  get params(): Committed1__Params {
    return new Committed1__Params(this);
  }
}

export class Committed1__Params {
  _event: Committed1;

  constructor(event: Committed1) {
    this._event = event;
  }

  get whitelist(): Array<Address> {
    return this._event.parameters[0].value.toAddressArray();
  }
}

export class Deposit extends ethereum.Event {
  get params(): Deposit__Params {
    return new Deposit__Params(this);
  }
}

export class Deposit__Params {
  _event: Deposit;

  constructor(event: Deposit) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get cToken(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get cTokenAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class EmergencyWithdraw extends ethereum.Event {
  get params(): EmergencyWithdraw__Params {
    return new EmergencyWithdraw__Params(this);
  }
}

export class EmergencyWithdraw__Params {
  _event: EmergencyWithdraw;

  constructor(event: EmergencyWithdraw) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get cToken(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get cTokenAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class GovernorSet extends ethereum.Event {
  get params(): GovernorSet__Params {
    return new GovernorSet__Params(this);
  }
}

export class GovernorSet__Params {
  _event: GovernorSet;

  constructor(event: GovernorSet) {
    this._event = event;
  }

  get governor(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Proposed extends ethereum.Event {
  get params(): Proposed__Params {
    return new Proposed__Params(this);
  }
}

export class Proposed__Params {
  _event: Proposed;

  constructor(event: Proposed) {
    this._event = event;
  }

  get timelock(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Proposed1 extends ethereum.Event {
  get params(): Proposed1__Params {
    return new Proposed1__Params(this);
  }
}

export class Proposed1__Params {
  _event: Proposed1;

  constructor(event: Proposed1) {
    this._event = event;
  }

  get whitelist(): Array<Address> {
    return this._event.parameters[0].value.toAddressArray();
  }
}

export class Withdraw extends ethereum.Event {
  get params(): Withdraw__Params {
    return new Withdraw__Params(this);
  }
}

export class Withdraw__Params {
  _event: Withdraw;

  constructor(event: Withdraw) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get cToken(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get cTokenAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class CompoundSupplyAggregator__hashOrderInput_orderStruct extends ethereum.Tuple {
  get syntheticId(): Address {
    return this[0].toAddress();
  }

  get oracleId(): Address {
    return this[1].toAddress();
  }

  get token(): Address {
    return this[2].toAddress();
  }

  get makerAddress(): Address {
    return this[3].toAddress();
  }

  get takerAddress(): Address {
    return this[4].toAddress();
  }

  get senderAddress(): Address {
    return this[5].toAddress();
  }

  get relayerAddress(): Address {
    return this[6].toAddress();
  }

  get affiliateAddress(): Address {
    return this[7].toAddress();
  }

  get feeTokenAddress(): Address {
    return this[8].toAddress();
  }

  get endTime(): BigInt {
    return this[9].toBigInt();
  }

  get quantity(): BigInt {
    return this[10].toBigInt();
  }

  get partialFill(): BigInt {
    return this[11].toBigInt();
  }

  get param0(): BigInt {
    return this[12].toBigInt();
  }

  get param1(): BigInt {
    return this[13].toBigInt();
  }

  get param2(): BigInt {
    return this[14].toBigInt();
  }

  get param3(): BigInt {
    return this[15].toBigInt();
  }

  get param4(): BigInt {
    return this[16].toBigInt();
  }

  get param5(): BigInt {
    return this[17].toBigInt();
  }

  get param6(): BigInt {
    return this[18].toBigInt();
  }

  get param7(): BigInt {
    return this[19].toBigInt();
  }

  get param8(): BigInt {
    return this[20].toBigInt();
  }

  get param9(): BigInt {
    return this[21].toBigInt();
  }

  get relayerFee(): BigInt {
    return this[22].toBigInt();
  }

  get affiliateFee(): BigInt {
    return this[23].toBigInt();
  }

  get nonce(): BigInt {
    return this[24].toBigInt();
  }

  get signature(): Bytes {
    return this[25].toBytes();
  }
}

export class CompoundSupplyAggregator__executeInput_orderStruct extends ethereum.Tuple {
  get syntheticId(): Address {
    return this[0].toAddress();
  }

  get oracleId(): Address {
    return this[1].toAddress();
  }

  get token(): Address {
    return this[2].toAddress();
  }

  get makerAddress(): Address {
    return this[3].toAddress();
  }

  get takerAddress(): Address {
    return this[4].toAddress();
  }

  get senderAddress(): Address {
    return this[5].toAddress();
  }

  get relayerAddress(): Address {
    return this[6].toAddress();
  }

  get affiliateAddress(): Address {
    return this[7].toAddress();
  }

  get feeTokenAddress(): Address {
    return this[8].toAddress();
  }

  get endTime(): BigInt {
    return this[9].toBigInt();
  }

  get quantity(): BigInt {
    return this[10].toBigInt();
  }

  get partialFill(): BigInt {
    return this[11].toBigInt();
  }

  get param0(): BigInt {
    return this[12].toBigInt();
  }

  get param1(): BigInt {
    return this[13].toBigInt();
  }

  get param2(): BigInt {
    return this[14].toBigInt();
  }

  get param3(): BigInt {
    return this[15].toBigInt();
  }

  get param4(): BigInt {
    return this[16].toBigInt();
  }

  get param5(): BigInt {
    return this[17].toBigInt();
  }

  get param6(): BigInt {
    return this[18].toBigInt();
  }

  get param7(): BigInt {
    return this[19].toBigInt();
  }

  get param8(): BigInt {
    return this[20].toBigInt();
  }

  get param9(): BigInt {
    return this[21].toBigInt();
  }

  get relayerFee(): BigInt {
    return this[22].toBigInt();
  }

  get affiliateFee(): BigInt {
    return this[23].toBigInt();
  }

  get nonce(): BigInt {
    return this[24].toBigInt();
  }

  get signature(): Bytes {
    return this[25].toBytes();
  }
}

export class CompoundSupplyAggregator extends ethereum.SmartContract {
  static bind(address: Address): CompoundSupplyAggregator {
    return new CompoundSupplyAggregator("CompoundSupplyAggregator", address);
  }

  BASE(): BigInt {
    let result = super.call("BASE", "BASE():(uint256)", []);

    return result[0].toBigInt();
  }

  try_BASE(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("BASE", "BASE():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  WHITELIST_TIMELOCK(): BigInt {
    let result = super.call(
      "WHITELIST_TIMELOCK",
      "WHITELIST_TIMELOCK():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_WHITELIST_TIMELOCK(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "WHITELIST_TIMELOCK",
      "WHITELIST_TIMELOCK():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balances(param0: Address, param1: BigInt, param2: Address): BigInt {
    let result = super.call(
      "balances",
      "balances(address,uint256,address):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );

    return result[0].toBigInt();
  }

  try_balances(
    param0: Address,
    param1: BigInt,
    param2: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balances",
      "balances(address,uint256,address):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromAddress(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getWhitelist(): Array<Address> {
    let result = super.call("getWhitelist", "getWhitelist():(address[])", []);

    return result[0].toAddressArray();
  }

  try_getWhitelist(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getWhitelist",
      "getWhitelist():(address[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  governor(): Address {
    let result = super.call("governor", "governor():(address)", []);

    return result[0].toAddress();
  }

  try_governor(): ethereum.CallResult<Address> {
    let result = super.tryCall("governor", "governor():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  hashOrder(
    _order: CompoundSupplyAggregator__hashOrderInput_orderStruct
  ): Bytes {
    let result = super.call(
      "hashOrder",
      "hashOrder((address,address,address,address,address,address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes)):(bytes32)",
      [ethereum.Value.fromTuple(_order)]
    );

    return result[0].toBytes();
  }

  try_hashOrder(
    _order: CompoundSupplyAggregator__hashOrderInput_orderStruct
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "hashOrder",
      "hashOrder((address,address,address,address,address,address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes)):(bytes32)",
      [ethereum.Value.fromTuple(_order)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  isOwner(): boolean {
    let result = super.call("isOwner", "isOwner():(bool)", []);

    return result[0].toBoolean();
  }

  try_isOwner(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isOwner", "isOwner():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  nonces(param0: Address): BigInt {
    let result = super.call("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_nonces(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  proposalTime(): BigInt {
    let result = super.call("proposalTime", "proposalTime():(uint256)", []);

    return result[0].toBigInt();
  }

  try_proposalTime(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("proposalTime", "proposalTime():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  proposedTimeLock(): BigInt {
    let result = super.call(
      "proposedTimeLock",
      "proposedTimeLock():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_proposedTimeLock(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "proposedTimeLock",
      "proposedTimeLock():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  proposedWhitelist(param0: BigInt): Address {
    let result = super.call(
      "proposedWhitelist",
      "proposedWhitelist(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_proposedWhitelist(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "proposedWhitelist",
      "proposedWhitelist(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  sendHelper(): Address {
    let result = super.call("sendHelper", "sendHelper():(address)", []);

    return result[0].toAddress();
  }

  try_sendHelper(): ethereum.CallResult<Address> {
    let result = super.tryCall("sendHelper", "sendHelper():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  timeLockInterval(): BigInt {
    let result = super.call(
      "timeLockInterval",
      "timeLockInterval():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_timeLockInterval(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "timeLockInterval",
      "timeLockInterval():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  timeLockProposalTime(): BigInt {
    let result = super.call(
      "timeLockProposalTime",
      "timeLockProposalTime():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_timeLockProposalTime(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "timeLockProposalTime",
      "timeLockProposalTime():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  execute(
    _command: Bytes,
    _order: CompoundSupplyAggregator__executeInput_orderStruct
  ): boolean {
    let result = super.call(
      "execute",
      "execute(bytes,(address,address,address,address,address,address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes)):(bool)",
      [ethereum.Value.fromBytes(_command), ethereum.Value.fromTuple(_order)]
    );

    return result[0].toBoolean();
  }

  try_execute(
    _command: Bytes,
    _order: CompoundSupplyAggregator__executeInput_orderStruct
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "execute",
      "execute(bytes,(address,address,address,address,address,address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes)):(bool)",
      [ethereum.Value.fromBytes(_command), ethereum.Value.fromTuple(_order)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _sendHelper(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CommitTimelockCall extends ethereum.Call {
  get inputs(): CommitTimelockCall__Inputs {
    return new CommitTimelockCall__Inputs(this);
  }

  get outputs(): CommitTimelockCall__Outputs {
    return new CommitTimelockCall__Outputs(this);
  }
}

export class CommitTimelockCall__Inputs {
  _call: CommitTimelockCall;

  constructor(call: CommitTimelockCall) {
    this._call = call;
  }
}

export class CommitTimelockCall__Outputs {
  _call: CommitTimelockCall;

  constructor(call: CommitTimelockCall) {
    this._call = call;
  }
}

export class CommitWhitelistCall extends ethereum.Call {
  get inputs(): CommitWhitelistCall__Inputs {
    return new CommitWhitelistCall__Inputs(this);
  }

  get outputs(): CommitWhitelistCall__Outputs {
    return new CommitWhitelistCall__Outputs(this);
  }
}

export class CommitWhitelistCall__Inputs {
  _call: CommitWhitelistCall;

  constructor(call: CommitWhitelistCall) {
    this._call = call;
  }
}

export class CommitWhitelistCall__Outputs {
  _call: CommitWhitelistCall;

  constructor(call: CommitWhitelistCall) {
    this._call = call;
  }
}

export class ProposeTimelockCall extends ethereum.Call {
  get inputs(): ProposeTimelockCall__Inputs {
    return new ProposeTimelockCall__Inputs(this);
  }

  get outputs(): ProposeTimelockCall__Outputs {
    return new ProposeTimelockCall__Outputs(this);
  }
}

export class ProposeTimelockCall__Inputs {
  _call: ProposeTimelockCall;

  constructor(call: ProposeTimelockCall) {
    this._call = call;
  }

  get _timelock(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposeTimelockCall__Outputs {
  _call: ProposeTimelockCall;

  constructor(call: ProposeTimelockCall) {
    this._call = call;
  }
}

export class ProposeWhitelistCall extends ethereum.Call {
  get inputs(): ProposeWhitelistCall__Inputs {
    return new ProposeWhitelistCall__Inputs(this);
  }

  get outputs(): ProposeWhitelistCall__Outputs {
    return new ProposeWhitelistCall__Outputs(this);
  }
}

export class ProposeWhitelistCall__Inputs {
  _call: ProposeWhitelistCall;

  constructor(call: ProposeWhitelistCall) {
    this._call = call;
  }

  get _whitelist(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class ProposeWhitelistCall__Outputs {
  _call: ProposeWhitelistCall;

  constructor(call: ProposeWhitelistCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetGovernorCall extends ethereum.Call {
  get inputs(): SetGovernorCall__Inputs {
    return new SetGovernorCall__Inputs(this);
  }

  get outputs(): SetGovernorCall__Outputs {
    return new SetGovernorCall__Outputs(this);
  }
}

export class SetGovernorCall__Inputs {
  _call: SetGovernorCall;

  constructor(call: SetGovernorCall) {
    this._call = call;
  }

  get _governor(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetGovernorCall__Outputs {
  _call: SetGovernorCall;

  constructor(call: SetGovernorCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class ExecuteCall extends ethereum.Call {
  get inputs(): ExecuteCall__Inputs {
    return new ExecuteCall__Inputs(this);
  }

  get outputs(): ExecuteCall__Outputs {
    return new ExecuteCall__Outputs(this);
  }
}

export class ExecuteCall__Inputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }

  get _command(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _order(): ExecuteCall_orderStruct {
    return this._call.inputValues[1].value.toTuple() as ExecuteCall_orderStruct;
  }
}

export class ExecuteCall__Outputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class ExecuteCall_orderStruct extends ethereum.Tuple {
  get syntheticId(): Address {
    return this[0].toAddress();
  }

  get oracleId(): Address {
    return this[1].toAddress();
  }

  get token(): Address {
    return this[2].toAddress();
  }

  get makerAddress(): Address {
    return this[3].toAddress();
  }

  get takerAddress(): Address {
    return this[4].toAddress();
  }

  get senderAddress(): Address {
    return this[5].toAddress();
  }

  get relayerAddress(): Address {
    return this[6].toAddress();
  }

  get affiliateAddress(): Address {
    return this[7].toAddress();
  }

  get feeTokenAddress(): Address {
    return this[8].toAddress();
  }

  get endTime(): BigInt {
    return this[9].toBigInt();
  }

  get quantity(): BigInt {
    return this[10].toBigInt();
  }

  get partialFill(): BigInt {
    return this[11].toBigInt();
  }

  get param0(): BigInt {
    return this[12].toBigInt();
  }

  get param1(): BigInt {
    return this[13].toBigInt();
  }

  get param2(): BigInt {
    return this[14].toBigInt();
  }

  get param3(): BigInt {
    return this[15].toBigInt();
  }

  get param4(): BigInt {
    return this[16].toBigInt();
  }

  get param5(): BigInt {
    return this[17].toBigInt();
  }

  get param6(): BigInt {
    return this[18].toBigInt();
  }

  get param7(): BigInt {
    return this[19].toBigInt();
  }

  get param8(): BigInt {
    return this[20].toBigInt();
  }

  get param9(): BigInt {
    return this[21].toBigInt();
  }

  get relayerFee(): BigInt {
    return this[22].toBigInt();
  }

  get affiliateFee(): BigInt {
    return this[23].toBigInt();
  }

  get nonce(): BigInt {
    return this[24].toBigInt();
  }

  get signature(): Bytes {
    return this[25].toBytes();
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _sender(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _cToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _cTokenAmount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class EmergencyWithdrawCall extends ethereum.Call {
  get inputs(): EmergencyWithdrawCall__Inputs {
    return new EmergencyWithdrawCall__Inputs(this);
  }

  get outputs(): EmergencyWithdrawCall__Outputs {
    return new EmergencyWithdrawCall__Outputs(this);
  }
}

export class EmergencyWithdrawCall__Inputs {
  _call: EmergencyWithdrawCall;

  constructor(call: EmergencyWithdrawCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _cToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class EmergencyWithdrawCall__Outputs {
  _call: EmergencyWithdrawCall;

  constructor(call: EmergencyWithdrawCall) {
    this._call = call;
  }
}

export class SetSendHelperCall extends ethereum.Call {
  get inputs(): SetSendHelperCall__Inputs {
    return new SetSendHelperCall__Inputs(this);
  }

  get outputs(): SetSendHelperCall__Outputs {
    return new SetSendHelperCall__Outputs(this);
  }
}

export class SetSendHelperCall__Inputs {
  _call: SetSendHelperCall;

  constructor(call: SetSendHelperCall) {
    this._call = call;
  }

  get _sendHelper(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetSendHelperCall__Outputs {
  _call: SetSendHelperCall;

  constructor(call: SetSendHelperCall) {
    this._call = call;
  }
}

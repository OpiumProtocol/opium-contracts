import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function zeroBI(): BigInt {
  return BigInt.fromI32(0);
}

export function zeroAddress(): Bytes {
  return Bytes.fromHexString('0x0000000000000000000000000000000000000000') as Bytes;
}

export function zeroHash(): Bytes {
  return Bytes.fromI32(0) as Bytes;
}

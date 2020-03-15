pragma solidity 0.5.16;

contract MatchingErrors {
    string constant internal ERROR_MATCH_CANCELLATION_NOT_ALLOWED = "MATCH:CANCELLATION_NOT_ALLOWED";
    string constant internal ERROR_MATCH_ALREADY_CANCELED = "MATCH:ALREADY_CANCELED";
    string constant internal ERROR_MATCH_ORDER_WAS_CANCELED = "MATCH:ORDER_WAS_CANCELED";

    string constant internal ERROR_MATCH_TAKER_ADDRESS_WRONG = "MATCH:TAKER_ADDRESS_WRONG";
    string constant internal ERROR_MATCH_ORDER_IS_EXPIRED = "MATCH:ORDER_IS_EXPIRED";
    string constant internal ERROR_MATCH_SENDER_ADDRESS_WRONG = "MATCH:SENDER_ADDRESS_WRONG";
    string constant internal ERROR_MATCH_SIGNATURE_NOT_VERIFIED = "MATCH:SIGNATURE_NOT_VERIFIED";
    string constant internal ERROR_MATCH_NOT_ENOUGH_ALLOWED_FEES = "MATCH:NOT_ENOUGH_ALLOWED_FEES";
}
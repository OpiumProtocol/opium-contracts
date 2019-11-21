[Core]: #Core
[Core-NO_DATA_CANCELLATION_PERIOD-uint256]: #Core-NO_DATA_CANCELLATION_PERIOD-uint256
[Core-poolVaults-mapping-address----mapping-address----uint256--]: #Core-poolVaults-mapping-address----mapping-address----uint256--
[Core-feesVaults-mapping-address----mapping-address----uint256--]: #Core-feesVaults-mapping-address----mapping-address----uint256--
[Core-cancelled-mapping-bytes32----bool-]: #Core-cancelled-mapping-bytes32----bool-
[Core-constructor-address-]: #Core-constructor-address-
[Core-withdrawFee-address-]: #Core-withdrawFee-address-
[Core-create-struct-LibDerivative-Derivative-uint256-address-2--]: #Core-create-struct-LibDerivative-Derivative-uint256-address-2--
[Core-execute-uint256-uint256-struct-LibDerivative-Derivative-]: #Core-execute-uint256-uint256-struct-LibDerivative-Derivative-
[Core-execute-address-uint256-uint256-struct-LibDerivative-Derivative-]: #Core-execute-address-uint256-uint256-struct-LibDerivative-Derivative-
[Core-execute-uint256---uint256---struct-LibDerivative-Derivative---]: #Core-execute-uint256---uint256---struct-LibDerivative-Derivative---
[Core-execute-address-uint256---uint256---struct-LibDerivative-Derivative---]: #Core-execute-address-uint256---uint256---struct-LibDerivative-Derivative---
[Core-cancel-uint256-uint256-struct-LibDerivative-Derivative-]: #Core-cancel-uint256-uint256-struct-LibDerivative-Derivative-
[Core-cancel-uint256---uint256---struct-LibDerivative-Derivative---]: #Core-cancel-uint256---uint256---struct-LibDerivative-Derivative---
[Core-Created-address-address-bytes32-uint256-]: #Core-Created-address-address-bytes32-uint256-
[Core-Executed-address-uint256-uint256-]: #Core-Executed-address-uint256-uint256-
[Core-Canceled-bytes32-]: #Core-Canceled-bytes32-
[CoreErrors]: #CoreErrors
[CoreErrors-ERROR_CORE_NOT_POOL-string]: #CoreErrors-ERROR_CORE_NOT_POOL-string
[CoreErrors-ERROR_CORE_CANT_BE_POOL-string]: #CoreErrors-ERROR_CORE_CANT_BE_POOL-string
[CoreErrors-ERROR_CORE_TICKER_WAS_CANCELLED-string]: #CoreErrors-ERROR_CORE_TICKER_WAS_CANCELLED-string
[CoreErrors-ERROR_CORE_SYNTHETIC_VALIDATION_ERROR-string]: #CoreErrors-ERROR_CORE_SYNTHETIC_VALIDATION_ERROR-string
[CoreErrors-ERROR_CORE_NOT_ENOUGH_TOKEN_ALLOWANCE-string]: #CoreErrors-ERROR_CORE_NOT_ENOUGH_TOKEN_ALLOWANCE-string
[CoreErrors-ERROR_CORE_TOKEN_IDS_AND_QUANTITIES_LENGTH_DOES_NOT_MATCH-string]: #CoreErrors-ERROR_CORE_TOKEN_IDS_AND_QUANTITIES_LENGTH_DOES_NOT_MATCH-string
[CoreErrors-ERROR_CORE_TOKEN_IDS_AND_DERIVATIVES_LENGTH_DOES_NOT_MATCH-string]: #CoreErrors-ERROR_CORE_TOKEN_IDS_AND_DERIVATIVES_LENGTH_DOES_NOT_MATCH-string
[CoreErrors-ERROR_CORE_EXECUTION_BEFORE_MATURITY_NOT_ALLOWED-string]: #CoreErrors-ERROR_CORE_EXECUTION_BEFORE_MATURITY_NOT_ALLOWED-string
[CoreErrors-ERROR_CORE_SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED-string]: #CoreErrors-ERROR_CORE_SYNTHETIC_EXECUTION_WAS_NOT_ALLOWED-string
[CoreErrors-ERROR_CORE_INSUFFICIENT_POOL_BALANCE-string]: #CoreErrors-ERROR_CORE_INSUFFICIENT_POOL_BALANCE-string
[CoreErrors-ERROR_CORE_CANT_CANCEL_DUMMY_ORACLE_ID-string]: #CoreErrors-ERROR_CORE_CANT_CANCEL_DUMMY_ORACLE_ID-string
[CoreErrors-ERROR_CORE_CANCELLATION_IS_NOT_ALLOWED-string]: #CoreErrors-ERROR_CORE_CANCELLATION_IS_NOT_ALLOWED-string
[CoreErrors-ERROR_CORE_UNKNOWN_POSITION_TYPE-string]: #CoreErrors-ERROR_CORE_UNKNOWN_POSITION_TYPE-string
[OracleAggregatorErrors]: #OracleAggregatorErrors
[OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_NOT_ENOUGH_ETHER-string]: #OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_NOT_ENOUGH_ETHER-string
[OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_QUERY_WAS_ALREADY_MADE-string]: #OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_QUERY_WAS_ALREADY_MADE-string
[OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_DATA_DOESNT_EXIST-string]: #OracleAggregatorErrors-ERROR_ORACLE_AGGREGATOR_DATA_DOESNT_EXIST-string
[RegistryErrors]: #RegistryErrors
[RegistryErrors-ERROR_REGISTRY_ONLY_INITIALIZER-string]: #RegistryErrors-ERROR_REGISTRY_ONLY_INITIALIZER-string
[RegistryErrors-ERROR_REGISTRY_ONLY_OPIUM_ADDRESS_ALLOWED-string]: #RegistryErrors-ERROR_REGISTRY_ONLY_OPIUM_ADDRESS_ALLOWED-string
[RegistryErrors-ERROR_REGISTRY_ALREADY_SET-string]: #RegistryErrors-ERROR_REGISTRY_ALREADY_SET-string
[SyntheticAggregatorErrors]: #SyntheticAggregatorErrors
[SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_DERIVATIVE_HASH_NOT_MATCH-string]: #SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_DERIVATIVE_HASH_NOT_MATCH-string
[SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_WRONG_MARGIN-string]: #SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_WRONG_MARGIN-string
[SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_COMMISSION_TOO_BIG-string]: #SyntheticAggregatorErrors-ERROR_SYNTHETIC_AGGREGATOR_COMMISSION_TOO_BIG-string
[usingRegistryErrors]: #usingRegistryErrors
[usingRegistryErrors-ERROR_USING_REGISTRY_ONLY_CORE_ALLOWED-string]: #usingRegistryErrors-ERROR_USING_REGISTRY_ONLY_CORE_ALLOWED-string
[IDerivativeLogic]: #IDerivativeLogic
[IDerivativeLogic-validateInput-struct-LibDerivative-Derivative-]: #IDerivativeLogic-validateInput-struct-LibDerivative-Derivative-
[IDerivativeLogic-getMargin-struct-LibDerivative-Derivative-]: #IDerivativeLogic-getMargin-struct-LibDerivative-Derivative-
[IDerivativeLogic-getExecutionPayout-struct-LibDerivative-Derivative-uint256-]: #IDerivativeLogic-getExecutionPayout-struct-LibDerivative-Derivative-uint256-
[IDerivativeLogic-getAuthorAddress--]: #IDerivativeLogic-getAuthorAddress--
[IDerivativeLogic-getAuthorCommission--]: #IDerivativeLogic-getAuthorCommission--
[IDerivativeLogic-thirdpartyExecutionAllowed-address-]: #IDerivativeLogic-thirdpartyExecutionAllowed-address-
[IDerivativeLogic-isPool--]: #IDerivativeLogic-isPool--
[IDerivativeLogic-allowThirdpartyExecution-bool-]: #IDerivativeLogic-allowThirdpartyExecution-bool-
[IDerivativeLogic-MetadataSet-string-]: #IDerivativeLogic-MetadataSet-string-
[IOracleId]: #IOracleId
[IOracleId-fetchData-uint256-]: #IOracleId-fetchData-uint256-
[IOracleId-recursivelyFetchData-uint256-uint256-uint256-]: #IOracleId-recursivelyFetchData-uint256-uint256-uint256-
[IOracleId-calculateFetchPrice--]: #IOracleId-calculateFetchPrice--
[IOracleId-MetadataSet-string-]: #IOracleId-MetadataSet-string-
[LibCommission]: #LibCommission
[LibCommission-COMMISSION_BASE-uint256]: #LibCommission-COMMISSION_BASE-uint256
[LibCommission-OPIUM_COMMISSION_BASE-uint256]: #LibCommission-OPIUM_COMMISSION_BASE-uint256
[LibCommission-OPIUM_COMMISSION_PART-uint256]: #LibCommission-OPIUM_COMMISSION_PART-uint256
[LibDerivative]: #LibDerivative
[LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-]: #LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-
[Whitelisted]: #Whitelisted
[Whitelisted-onlyWhitelisted--]: #Whitelisted-onlyWhitelisted--
[Whitelisted-whitelist-address--]: #Whitelisted-whitelist-address--
[Whitelisted-getWhitelist--]: #Whitelisted-getWhitelist--
[WhitelistedWithGovernance]: #WhitelistedWithGovernance
[WhitelistedWithGovernance-onlyGovernor--]: #WhitelistedWithGovernance-onlyGovernor--
[WhitelistedWithGovernance-TIME_LOCK_INTERVAL-uint256]: #WhitelistedWithGovernance-TIME_LOCK_INTERVAL-uint256
[WhitelistedWithGovernance-governor-address]: #WhitelistedWithGovernance-governor-address
[WhitelistedWithGovernance-initialized-bool]: #WhitelistedWithGovernance-initialized-bool
[WhitelistedWithGovernance-proposalTime-uint256]: #WhitelistedWithGovernance-proposalTime-uint256
[WhitelistedWithGovernance-proposedWhitelist-address--]: #WhitelistedWithGovernance-proposedWhitelist-address--
[WhitelistedWithGovernance-constructor-uint256-address-]: #WhitelistedWithGovernance-constructor-uint256-address-
[WhitelistedWithGovernance-proposeWhitelist-address---]: #WhitelistedWithGovernance-proposeWhitelist-address---
[WhitelistedWithGovernance-commitWhitelist--]: #WhitelistedWithGovernance-commitWhitelist--
[WhitelistedWithGovernance-setGovernor-address-]: #WhitelistedWithGovernance-setGovernor-address-
[WhitelistedWithGovernance-GovernorSet-address-]: #WhitelistedWithGovernance-GovernorSet-address-
[WhitelistedWithGovernance-Proposed-address---]: #WhitelistedWithGovernance-Proposed-address---
[WhitelistedWithGovernance-Committed-address---]: #WhitelistedWithGovernance-Committed-address---
[WhitelistedWithGovernanceAndChangableTimelock]: #WhitelistedWithGovernanceAndChangableTimelock
[WhitelistedWithGovernanceAndChangableTimelock-timelockProposalTime-uint256]: #WhitelistedWithGovernanceAndChangableTimelock-timelockProposalTime-uint256
[WhitelistedWithGovernanceAndChangableTimelock-proposedTimelock-uint256]: #WhitelistedWithGovernanceAndChangableTimelock-proposedTimelock-uint256
[WhitelistedWithGovernanceAndChangableTimelock-proposeTimelock-uint256-]: #WhitelistedWithGovernanceAndChangableTimelock-proposeTimelock-uint256-
[WhitelistedWithGovernanceAndChangableTimelock-commitTimelock--]: #WhitelistedWithGovernanceAndChangableTimelock-commitTimelock--
[WhitelistedWithGovernanceAndChangableTimelock-Proposed-uint256-]: #WhitelistedWithGovernanceAndChangableTimelock-Proposed-uint256-
[WhitelistedWithGovernanceAndChangableTimelock-Committed-uint256-]: #WhitelistedWithGovernanceAndChangableTimelock-Committed-uint256-
[usingRegistry]: #usingRegistry
[usingRegistry-onlyCore--]: #usingRegistry-onlyCore--
[usingRegistry-registry-contract-Registry]: #usingRegistry-registry-contract-Registry
[usingRegistry-constructor-address-]: #usingRegistry-constructor-address-
[usingRegistry-RegistrySet-address-]: #usingRegistry-RegistrySet-address-
[Migrations]: #Migrations
[Migrations-restricted--]: #Migrations-restricted--
[Migrations-owner-address]: #Migrations-owner-address
[Migrations-last_completed_migration-uint256]: #Migrations-last_completed_migration-uint256
[Migrations-setCompleted-uint256-]: #Migrations-setCompleted-uint256-
[Migrations-upgrade-address-]: #Migrations-upgrade-address-
[OracleAggregator]: #OracleAggregator
[OracleAggregator-enoughEtherProvided-address-uint256-]: #OracleAggregator-enoughEtherProvided-address-uint256-
[OracleAggregator-dataCache-mapping-address----mapping-uint256----uint256--]: #OracleAggregator-dataCache-mapping-address----mapping-uint256----uint256--
[OracleAggregator-dataExist-mapping-address----mapping-uint256----bool--]: #OracleAggregator-dataExist-mapping-address----mapping-uint256----bool--
[OracleAggregator-dataRequested-mapping-address----mapping-uint256----bool--]: #OracleAggregator-dataRequested-mapping-address----mapping-uint256----bool--
[OracleAggregator-fetchData-address-uint256-]: #OracleAggregator-fetchData-address-uint256-
[OracleAggregator-recursivelyFetchData-address-uint256-uint256-uint256-]: #OracleAggregator-recursivelyFetchData-address-uint256-uint256-uint256-
[OracleAggregator-__callback-uint256-uint256-]: #OracleAggregator-__callback-uint256-uint256-
[OracleAggregator-calculateFetchPrice-address-]: #OracleAggregator-calculateFetchPrice-address-
[OracleAggregator-getData-address-uint256-]: #OracleAggregator-getData-address-uint256-
[OracleAggregator-hasData-address-uint256-]: #OracleAggregator-hasData-address-uint256-
[Registry]: #Registry
[Registry-onlyInitializer--]: #Registry-onlyInitializer--
[Registry-initializer-address]: #Registry-initializer-address
[Registry-constructor--]: #Registry-constructor--
[Registry-setMinter-address-]: #Registry-setMinter-address-
[Registry-setCore-address-]: #Registry-setCore-address-
[Registry-setOracleAggregator-address-]: #Registry-setOracleAggregator-address-
[Registry-setSyntheticAggregator-address-]: #Registry-setSyntheticAggregator-address-
[Registry-setOpiumAddress-address-]: #Registry-setOpiumAddress-address-
[Registry-setTokenSpender-address-]: #Registry-setTokenSpender-address-
[Registry-setWethAddress-address-]: #Registry-setWethAddress-address-
[Registry-changeOpiumAddress-address-]: #Registry-changeOpiumAddress-address-
[Registry-getCore--]: #Registry-getCore--
[Registry-getMinter--]: #Registry-getMinter--
[Registry-getOracleAggregator--]: #Registry-getOracleAggregator--
[Registry-getSyntheticAggregator--]: #Registry-getSyntheticAggregator--
[Registry-getOpiumAddress--]: #Registry-getOpiumAddress--
[Registry-getTokenSpender--]: #Registry-getTokenSpender--
[Registry-getWethAddress--]: #Registry-getWethAddress--
[SyntheticAggregator]: #SyntheticAggregator
[SyntheticAggregator-buyerMarginByHash-mapping-bytes32----uint256-]: #SyntheticAggregator-buyerMarginByHash-mapping-bytes32----uint256-
[SyntheticAggregator-sellerMarginByHash-mapping-bytes32----uint256-]: #SyntheticAggregator-sellerMarginByHash-mapping-bytes32----uint256-
[SyntheticAggregator-typeByHash-mapping-bytes32----enum-SyntheticAggregator-SyntheticTypes-]: #SyntheticAggregator-typeByHash-mapping-bytes32----enum-SyntheticAggregator-SyntheticTypes-
[SyntheticAggregator-commissionByHash-mapping-bytes32----uint256-]: #SyntheticAggregator-commissionByHash-mapping-bytes32----uint256-
[SyntheticAggregator-authorAddressByHash-mapping-bytes32----address-]: #SyntheticAggregator-authorAddressByHash-mapping-bytes32----address-
[SyntheticAggregator-getAuthorCommission-bytes32-struct-LibDerivative-Derivative-]: #SyntheticAggregator-getAuthorCommission-bytes32-struct-LibDerivative-Derivative-
[SyntheticAggregator-getAuthorAddress-bytes32-struct-LibDerivative-Derivative-]: #SyntheticAggregator-getAuthorAddress-bytes32-struct-LibDerivative-Derivative-
[SyntheticAggregator-getMargin-bytes32-struct-LibDerivative-Derivative-]: #SyntheticAggregator-getMargin-bytes32-struct-LibDerivative-Derivative-
[SyntheticAggregator-isPool-bytes32-struct-LibDerivative-Derivative-]: #SyntheticAggregator-isPool-bytes32-struct-LibDerivative-Derivative-
[SyntheticAggregator-Create-struct-LibDerivative-Derivative-bytes32-]: #SyntheticAggregator-Create-struct-LibDerivative-Derivative-bytes32-
[TokenMinter]: #TokenMinter
[TokenMinter-constructor-string-address-]: #TokenMinter-constructor-string-address-
[TokenMinter-mint-address-address-bytes32-uint256-]: #TokenMinter-mint-address-address-bytes32-uint256-
[TokenMinter-mint-address-bytes32-uint256-]: #TokenMinter-mint-address-bytes32-uint256-
[TokenMinter-burn-address-uint256-uint256-]: #TokenMinter-burn-address-uint256-uint256-
[TokenMinter-name--]: #TokenMinter-name--
[TokenMinter-symbol--]: #TokenMinter-symbol--
[TokenMinter-isApprovedOrOwner-address-address-uint256-]: #TokenMinter-isApprovedOrOwner-address-address-uint256-
[TokenMinter-isOpiumSpender-address-]: #TokenMinter-isOpiumSpender-address-
[TokenSpender]: #TokenSpender
[TokenSpender-WHITELIST_TIMELOCK-uint256]: #TokenSpender-WHITELIST_TIMELOCK-uint256
[TokenSpender-constructor-address-]: #TokenSpender-constructor-address-
[TokenSpender-claimTokens-contract-IERC20-address-address-uint256-]: #TokenSpender-claimTokens-contract-IERC20-address-address-uint256-
[TokenSpender-claimPositions-contract-IERC721O-address-address-uint256-uint256-]: #TokenSpender-claimPositions-contract-IERC721O-address-address-uint256-uint256-
## <span id="Core"></span> `Core`





- [`nonReentrant()`][ReentrancyGuard-nonReentrant--]
- [`onlyCore()`][usingRegistry-onlyCore--]
- [`constructor(address _registry)`][Core-constructor-address-]
- [`withdrawFee(address _tokenAddress)`][Core-withdrawFee-address-]
- [`create(struct LibDerivative.Derivative _derivative, uint256 _quantity, address[2] _addresses)`][Core-create-struct-LibDerivative-Derivative-uint256-address-2--]
- [`execute(uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)`][Core-execute-uint256-uint256-struct-LibDerivative-Derivative-]
- [`execute(address _tokenOwner, uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)`][Core-execute-address-uint256-uint256-struct-LibDerivative-Derivative-]
- [`execute(uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)`][Core-execute-uint256---uint256---struct-LibDerivative-Derivative---]
- [`execute(address _tokenOwner, uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)`][Core-execute-address-uint256---uint256---struct-LibDerivative-Derivative---]
- [`cancel(uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)`][Core-cancel-uint256-uint256-struct-LibDerivative-Derivative-]
- [`cancel(uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)`][Core-cancel-uint256---uint256---struct-LibDerivative-Derivative---]
- [`getDerivativeHash(struct LibDerivative.Derivative _derivative)`][LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-]
- [`Created(address buyer, address seller, bytes32 derivativeHash, uint256 quantity)`][Core-Created-address-address-bytes32-uint256-]
- [`Executed(address tokenOwner, uint256 tokenId, uint256 quantity)`][Core-Executed-address-uint256-uint256-]
- [`Canceled(bytes32 derivativeHash)`][Core-Canceled-bytes32-]
- [`RegistrySet(address registry)`][usingRegistry-RegistrySet-address-]

### <span id="Core-constructor-address-"></span> `constructor(address _registry)` (public)

Calls Core.Lib.usingRegistry constructor



### <span id="Core-withdrawFee-address-"></span> `withdrawFee(address _tokenAddress)` (public)

This function allows fee recipients to withdraw their fees




### <span id="Core-create-struct-LibDerivative-Derivative-uint256-address-2--"></span> `create(struct LibDerivative.Derivative _derivative, uint256 _quantity, address[2] _addresses)` (public)

Creates derivative contracts (positions)




### <span id="Core-execute-uint256-uint256-struct-LibDerivative-Derivative-"></span> `execute(uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)` (public)

Executes several positions of `msg.sender` with same `tokenId`




### <span id="Core-execute-address-uint256-uint256-struct-LibDerivative-Derivative-"></span> `execute(address _tokenOwner, uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)` (public)

Executes several positions of `_tokenOwner` with same `tokenId`




### <span id="Core-execute-uint256---uint256---struct-LibDerivative-Derivative---"></span> `execute(uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)` (public)

Executes several positions of `msg.sender` with different `tokenId`s




### <span id="Core-execute-address-uint256---uint256---struct-LibDerivative-Derivative---"></span> `execute(address _tokenOwner, uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)` (public)

Executes several positions of `_tokenOwner` with different `tokenId`s




### <span id="Core-cancel-uint256-uint256-struct-LibDerivative-Derivative-"></span> `cancel(uint256 _tokenId, uint256 _quantity, struct LibDerivative.Derivative _derivative)` (public)

Cancels tickers, burns positions and returns margins to positions owners in case no data were provided within `NO_DATA_CANCELLATION_PERIOD`




### <span id="Core-cancel-uint256---uint256---struct-LibDerivative-Derivative---"></span> `cancel(uint256[] _tokenIds, uint256[] _quantities, struct LibDerivative.Derivative[] _derivatives)` (public)

Cancels tickers, burns positions and returns margins to positions owners in case no data were provided within `NO_DATA_CANCELLATION_PERIOD`




### <span id="Core-Created-address-address-bytes32-uint256-"></span> `Created(address buyer, address seller, bytes32 derivativeHash, uint256 quantity)`





### <span id="Core-Executed-address-uint256-uint256-"></span> `Executed(address tokenOwner, uint256 tokenId, uint256 quantity)`





### <span id="Core-Canceled-bytes32-"></span> `Canceled(bytes32 derivativeHash)`







## <span id="CoreErrors"></span> `CoreErrors`








## <span id="OracleAggregatorErrors"></span> `OracleAggregatorErrors`








## <span id="RegistryErrors"></span> `RegistryErrors`








## <span id="SyntheticAggregatorErrors"></span> `SyntheticAggregatorErrors`








## <span id="usingRegistryErrors"></span> `usingRegistryErrors`








## <span id="IDerivativeLogic"></span> `IDerivativeLogic`





- [`validateInput(struct LibDerivative.Derivative _derivative)`][IDerivativeLogic-validateInput-struct-LibDerivative-Derivative-]
- [`getMargin(struct LibDerivative.Derivative _derivative)`][IDerivativeLogic-getMargin-struct-LibDerivative-Derivative-]
- [`getExecutionPayout(struct LibDerivative.Derivative _derivative, uint256 _result)`][IDerivativeLogic-getExecutionPayout-struct-LibDerivative-Derivative-uint256-]
- [`getAuthorAddress()`][IDerivativeLogic-getAuthorAddress--]
- [`getAuthorCommission()`][IDerivativeLogic-getAuthorCommission--]
- [`thirdpartyExecutionAllowed(address _derivativeOwner)`][IDerivativeLogic-thirdpartyExecutionAllowed-address-]
- [`isPool()`][IDerivativeLogic-isPool--]
- [`allowThirdpartyExecution(bool _allow)`][IDerivativeLogic-allowThirdpartyExecution-bool-]
- [`getDerivativeHash(struct LibDerivative.Derivative _derivative)`][LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-]
- [`MetadataSet(string metadata)`][IDerivativeLogic-MetadataSet-string-]

### <span id="IDerivativeLogic-validateInput-struct-LibDerivative-Derivative-"></span> `validateInput(struct LibDerivative.Derivative _derivative) → bool` (public)

Validates ticker




### <span id="IDerivativeLogic-getMargin-struct-LibDerivative-Derivative-"></span> `getMargin(struct LibDerivative.Derivative _derivative) → uint256 buyerMargin, uint256 sellerMargin` (public)

Calculates margin required for derivative creation




### <span id="IDerivativeLogic-getExecutionPayout-struct-LibDerivative-Derivative-uint256-"></span> `getExecutionPayout(struct LibDerivative.Derivative _derivative, uint256 _result) → uint256 buyerPayout, uint256 sellerPayout` (public)

Calculates payout for derivative execution




### <span id="IDerivativeLogic-getAuthorAddress--"></span> `getAuthorAddress() → address authorAddress` (public)

Returns syntheticId author address for Opium commissions




### <span id="IDerivativeLogic-getAuthorCommission--"></span> `getAuthorCommission() → uint256 commission` (public)

Returns syntheticId author commission in base of COMMISSION_BASE




### <span id="IDerivativeLogic-thirdpartyExecutionAllowed-address-"></span> `thirdpartyExecutionAllowed(address _derivativeOwner) → bool` (public)

Returns whether thirdparty could execute on derivative's owner's behalf




### <span id="IDerivativeLogic-isPool--"></span> `isPool() → bool` (public)

Returns whether syntheticId implements pool logic




### <span id="IDerivativeLogic-allowThirdpartyExecution-bool-"></span> `allowThirdpartyExecution(bool _allow)` (public)

Sets whether thirds parties are allowed or not to execute derivative's on msg.sender's behalf




### <span id="IDerivativeLogic-MetadataSet-string-"></span> `MetadataSet(string metadata)`







## <span id="IOracleId"></span> `IOracleId`





- [`fetchData(uint256 timestamp)`][IOracleId-fetchData-uint256-]
- [`recursivelyFetchData(uint256 timestamp, uint256 period, uint256 times)`][IOracleId-recursivelyFetchData-uint256-uint256-uint256-]
- [`calculateFetchPrice()`][IOracleId-calculateFetchPrice--]
- [`MetadataSet(string metadata)`][IOracleId-MetadataSet-string-]

### <span id="IOracleId-fetchData-uint256-"></span> `fetchData(uint256 timestamp)` (external)

Requests data from `oracleId` one time




### <span id="IOracleId-recursivelyFetchData-uint256-uint256-uint256-"></span> `recursivelyFetchData(uint256 timestamp, uint256 period, uint256 times)` (external)

Requests data from `oracleId` multiple times




### <span id="IOracleId-calculateFetchPrice--"></span> `calculateFetchPrice() → uint256 fetchPrice` (external)

Requests and returns price in ETH for one request. This function could be called as `view` function. Oraclize API for price calculations restricts making this function as view.




### <span id="IOracleId-MetadataSet-string-"></span> `MetadataSet(string metadata)`







## <span id="LibCommission"></span> `LibCommission`








## <span id="LibDerivative"></span> `LibDerivative`





- [`getDerivativeHash(struct LibDerivative.Derivative _derivative)`][LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-]

### <span id="LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-"></span> `getDerivativeHash(struct LibDerivative.Derivative _derivative) → bytes32 derivativeHash` (public)

Calculates hash of provided Derivative






## <span id="Whitelisted"></span> `Whitelisted`





- [`onlyWhitelisted()`][Whitelisted-onlyWhitelisted--]
- [`getWhitelist()`][Whitelisted-getWhitelist--]

### <span id="Whitelisted-onlyWhitelisted--"></span> `onlyWhitelisted()`

This modifier restricts access to functions, which could be called only by whitelisted addresses



### <span id="Whitelisted-getWhitelist--"></span> `getWhitelist() → address[]` (public)

Getter for whitelisted addresses array






## <span id="WhitelistedWithGovernance"></span> `WhitelistedWithGovernance`





- [`onlyGovernor()`][WhitelistedWithGovernance-onlyGovernor--]
- [`onlyWhitelisted()`][Whitelisted-onlyWhitelisted--]
- [`constructor(uint256 _timeLockInterval, address _governor)`][WhitelistedWithGovernance-constructor-uint256-address-]
- [`proposeWhitelist(address[] _whitelist)`][WhitelistedWithGovernance-proposeWhitelist-address---]
- [`commitWhitelist()`][WhitelistedWithGovernance-commitWhitelist--]
- [`setGovernor(address _governor)`][WhitelistedWithGovernance-setGovernor-address-]
- [`getWhitelist()`][Whitelisted-getWhitelist--]
- [`GovernorSet(address governor)`][WhitelistedWithGovernance-GovernorSet-address-]
- [`Proposed(address[] whitelist)`][WhitelistedWithGovernance-Proposed-address---]
- [`Committed(address[] whitelist)`][WhitelistedWithGovernance-Committed-address---]

### <span id="WhitelistedWithGovernance-onlyGovernor--"></span> `onlyGovernor()`

This modifier restricts access to functions, which could be called only by governor



### <span id="WhitelistedWithGovernance-constructor-uint256-address-"></span> `constructor(uint256 _timeLockInterval, address _governor)` (public)

Contract constructor




### <span id="WhitelistedWithGovernance-proposeWhitelist-address---"></span> `proposeWhitelist(address[] _whitelist)` (public)

Calling this function governor could propose new whitelist addresses array. Also it allows to initialize first whitelist if it was not initialized yet.



### <span id="WhitelistedWithGovernance-commitWhitelist--"></span> `commitWhitelist()` (public)

Calling this function governor commits proposed whitelist if timelock interval of proposal was passed



### <span id="WhitelistedWithGovernance-setGovernor-address-"></span> `setGovernor(address _governor)` (public)

This function allows governor to transfer governance to a new governor and emits event




### <span id="WhitelistedWithGovernance-GovernorSet-address-"></span> `GovernorSet(address governor)`





### <span id="WhitelistedWithGovernance-Proposed-address---"></span> `Proposed(address[] whitelist)`





### <span id="WhitelistedWithGovernance-Committed-address---"></span> `Committed(address[] whitelist)`







## <span id="WhitelistedWithGovernanceAndChangableTimelock"></span> `WhitelistedWithGovernanceAndChangableTimelock`

Opium.Lib.WhitelistedWithGovernanceAndChangableTimelock contract implements Opium.Lib.WhitelistedWithGovernance and adds possibility for governor to change timelock interval within timelock interval



- [`onlyGovernor()`][WhitelistedWithGovernance-onlyGovernor--]
- [`onlyWhitelisted()`][Whitelisted-onlyWhitelisted--]
- [`proposeTimelock(uint256 _timelock)`][WhitelistedWithGovernanceAndChangableTimelock-proposeTimelock-uint256-]
- [`commitTimelock()`][WhitelistedWithGovernanceAndChangableTimelock-commitTimelock--]
- [`constructor(uint256 _timeLockInterval, address _governor)`][WhitelistedWithGovernance-constructor-uint256-address-]
- [`proposeWhitelist(address[] _whitelist)`][WhitelistedWithGovernance-proposeWhitelist-address---]
- [`commitWhitelist()`][WhitelistedWithGovernance-commitWhitelist--]
- [`setGovernor(address _governor)`][WhitelistedWithGovernance-setGovernor-address-]
- [`getWhitelist()`][Whitelisted-getWhitelist--]
- [`Proposed(uint256 timelock)`][WhitelistedWithGovernanceAndChangableTimelock-Proposed-uint256-]
- [`Committed(uint256 timelock)`][WhitelistedWithGovernanceAndChangableTimelock-Committed-uint256-]
- [`GovernorSet(address governor)`][WhitelistedWithGovernance-GovernorSet-address-]
- [`Proposed(address[] whitelist)`][WhitelistedWithGovernance-Proposed-address---]
- [`Committed(address[] whitelist)`][WhitelistedWithGovernance-Committed-address---]

### <span id="WhitelistedWithGovernanceAndChangableTimelock-proposeTimelock-uint256-"></span> `proposeTimelock(uint256 _timelock)` (public)

Calling this function governor could propose new timelock




### <span id="WhitelistedWithGovernanceAndChangableTimelock-commitTimelock--"></span> `commitTimelock()` (public)

Calling this function governor could commit previously proposed new timelock if timelock interval of proposal was passed



### <span id="WhitelistedWithGovernanceAndChangableTimelock-Proposed-uint256-"></span> `Proposed(uint256 timelock)`





### <span id="WhitelistedWithGovernanceAndChangableTimelock-Committed-uint256-"></span> `Committed(uint256 timelock)`







## <span id="usingRegistry"></span> `usingRegistry`





- [`onlyCore()`][usingRegistry-onlyCore--]
- [`constructor(address _registry)`][usingRegistry-constructor-address-]
- [`RegistrySet(address registry)`][usingRegistry-RegistrySet-address-]

### <span id="usingRegistry-onlyCore--"></span> `onlyCore()`

This modifier restricts access to functions, which could be called only by Opium.Core



### <span id="usingRegistry-constructor-address-"></span> `constructor(address _registry)` (public)

Defines registry instance and emits appropriate event



### <span id="usingRegistry-RegistrySet-address-"></span> `RegistrySet(address registry)`







## <span id="Migrations"></span> `Migrations`





- [`restricted()`][Migrations-restricted--]
- [`setCompleted(uint256 completed)`][Migrations-setCompleted-uint256-]
- [`upgrade(address new_address)`][Migrations-upgrade-address-]

### <span id="Migrations-restricted--"></span> `restricted()`





### <span id="Migrations-setCompleted-uint256-"></span> `setCompleted(uint256 completed)` (public)





### <span id="Migrations-upgrade-address-"></span> `upgrade(address new_address)` (public)







## <span id="OracleAggregator"></span> `OracleAggregator`





- [`enoughEtherProvided(address oracleId, uint256 times)`][OracleAggregator-enoughEtherProvided-address-uint256-]
- [`nonReentrant()`][ReentrancyGuard-nonReentrant--]
- [`fetchData(address oracleId, uint256 timestamp)`][OracleAggregator-fetchData-address-uint256-]
- [`recursivelyFetchData(address oracleId, uint256 timestamp, uint256 period, uint256 times)`][OracleAggregator-recursivelyFetchData-address-uint256-uint256-uint256-]
- [`__callback(uint256 timestamp, uint256 data)`][OracleAggregator-__callback-uint256-uint256-]
- [`calculateFetchPrice(address oracleId)`][OracleAggregator-calculateFetchPrice-address-]
- [`getData(address oracleId, uint256 timestamp)`][OracleAggregator-getData-address-uint256-]
- [`hasData(address oracleId, uint256 timestamp)`][OracleAggregator-hasData-address-uint256-]
- [`constructor()`][ReentrancyGuard-constructor--]

### <span id="OracleAggregator-enoughEtherProvided-address-uint256-"></span> `enoughEtherProvided(address oracleId, uint256 times)`

Checks whether enough ETH were provided withing data request to proceed




### <span id="OracleAggregator-fetchData-address-uint256-"></span> `fetchData(address oracleId, uint256 timestamp)` (public)

Requests data from `oracleId` one time




### <span id="OracleAggregator-recursivelyFetchData-address-uint256-uint256-uint256-"></span> `recursivelyFetchData(address oracleId, uint256 timestamp, uint256 period, uint256 times)` (public)

Requests data from `oracleId` multiple times




### <span id="OracleAggregator-__callback-uint256-uint256-"></span> `__callback(uint256 timestamp, uint256 data)` (public)

Receives and caches data from `msg.sender`




### <span id="OracleAggregator-calculateFetchPrice-address-"></span> `calculateFetchPrice(address oracleId) → uint256 fetchPrice` (public)

Requests and returns price in ETH for one request. This function could be called as `view` function. Oraclize API for price calculations restricts making this function as view.




### <span id="OracleAggregator-getData-address-uint256-"></span> `getData(address oracleId, uint256 timestamp) → uint256 dataResult` (public)

Returns cached data if they exist, or reverts with an error




### <span id="OracleAggregator-hasData-address-uint256-"></span> `hasData(address oracleId, uint256 timestamp) → bool result` (public)

Getter for dataExist mapping






## <span id="Registry"></span> `Registry`





- [`onlyInitializer()`][Registry-onlyInitializer--]
- [`constructor()`][Registry-constructor--]
- [`setMinter(address _minter)`][Registry-setMinter-address-]
- [`setCore(address _core)`][Registry-setCore-address-]
- [`setOracleAggregator(address _oracleAggregator)`][Registry-setOracleAggregator-address-]
- [`setSyntheticAggregator(address _syntheticAggregator)`][Registry-setSyntheticAggregator-address-]
- [`setOpiumAddress(address _opiumAddress)`][Registry-setOpiumAddress-address-]
- [`setTokenSpender(address _tokenSpender)`][Registry-setTokenSpender-address-]
- [`setWethAddress(address _wethAddress)`][Registry-setWethAddress-address-]
- [`changeOpiumAddress(address _opiumAddress)`][Registry-changeOpiumAddress-address-]
- [`getCore()`][Registry-getCore--]
- [`getMinter()`][Registry-getMinter--]
- [`getOracleAggregator()`][Registry-getOracleAggregator--]
- [`getSyntheticAggregator()`][Registry-getSyntheticAggregator--]
- [`getOpiumAddress()`][Registry-getOpiumAddress--]
- [`getTokenSpender()`][Registry-getTokenSpender--]
- [`getWethAddress()`][Registry-getWethAddress--]

### <span id="Registry-onlyInitializer--"></span> `onlyInitializer()`

This modifier restricts access to functions, which could be called only by initializer



### <span id="Registry-constructor--"></span> `constructor()` (public)

Sets initializer



### <span id="Registry-setMinter-address-"></span> `setMinter(address _minter)` (external)

Sets Opium.TokenMinter address and allows to do it only once




### <span id="Registry-setCore-address-"></span> `setCore(address _core)` (external)

Sets Opium.Core address and allows to do it only once




### <span id="Registry-setOracleAggregator-address-"></span> `setOracleAggregator(address _oracleAggregator)` (external)

Sets Opium.OracleAggregator address and allows to do it only once




### <span id="Registry-setSyntheticAggregator-address-"></span> `setSyntheticAggregator(address _syntheticAggregator)` (external)

Sets Opium.SyntheticAggregator address and allows to do it only once




### <span id="Registry-setOpiumAddress-address-"></span> `setOpiumAddress(address _opiumAddress)` (external)

Sets Opium commission receiver and allows to do it only once




### <span id="Registry-setTokenSpender-address-"></span> `setTokenSpender(address _tokenSpender)` (external)

Sets Opium.TokenSpender address and allows to do it only once




### <span id="Registry-setWethAddress-address-"></span> `setWethAddress(address _wethAddress)` (external)

Sets WETH address and allows to do it only once




### <span id="Registry-changeOpiumAddress-address-"></span> `changeOpiumAddress(address _opiumAddress)` (external)

Allows opium commission receiver address to change itself




### <span id="Registry-getCore--"></span> `getCore() → address result` (external)

Returns address of Opium.Core




### <span id="Registry-getMinter--"></span> `getMinter() → address result` (external)

Returns address of Opium.TokenMinter




### <span id="Registry-getOracleAggregator--"></span> `getOracleAggregator() → address result` (external)

Returns address of Opium.OracleAggregator




### <span id="Registry-getSyntheticAggregator--"></span> `getSyntheticAggregator() → address result` (external)

Returns address of Opium.SyntheticAggregator




### <span id="Registry-getOpiumAddress--"></span> `getOpiumAddress() → address result` (external)

Returns address of Opium commission receiver




### <span id="Registry-getTokenSpender--"></span> `getTokenSpender() → address result` (external)

Returns address of Opium.TokenSpender




### <span id="Registry-getWethAddress--"></span> `getWethAddress() → address result` (external)

Returns address of WETH






## <span id="SyntheticAggregator"></span> `SyntheticAggregator`

Opium.SyntheticAggregator contract initialized, identifies and caches syntheticId sensitive data



- [`nonReentrant()`][ReentrancyGuard-nonReentrant--]
- [`getAuthorCommission(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative)`][SyntheticAggregator-getAuthorCommission-bytes32-struct-LibDerivative-Derivative-]
- [`getAuthorAddress(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative)`][SyntheticAggregator-getAuthorAddress-bytes32-struct-LibDerivative-Derivative-]
- [`getMargin(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative)`][SyntheticAggregator-getMargin-bytes32-struct-LibDerivative-Derivative-]
- [`isPool(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative)`][SyntheticAggregator-isPool-bytes32-struct-LibDerivative-Derivative-]
- [`constructor()`][ReentrancyGuard-constructor--]
- [`getDerivativeHash(struct LibDerivative.Derivative _derivative)`][LibDerivative-getDerivativeHash-struct-LibDerivative-Derivative-]
- [`Create(struct LibDerivative.Derivative derivative, bytes32 derivativeHash)`][SyntheticAggregator-Create-struct-LibDerivative-Derivative-bytes32-]

### <span id="SyntheticAggregator-getAuthorCommission-bytes32-struct-LibDerivative-Derivative-"></span> `getAuthorCommission(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative) → uint256 commission` (public)

Initializes ticker, if was not initialized and returns `syntheticId` author commission from cache




### <span id="SyntheticAggregator-getAuthorAddress-bytes32-struct-LibDerivative-Derivative-"></span> `getAuthorAddress(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative) → address authorAddress` (public)

Initializes ticker, if was not initialized and returns `syntheticId` author address from cache




### <span id="SyntheticAggregator-getMargin-bytes32-struct-LibDerivative-Derivative-"></span> `getMargin(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative) → uint256 buyerMargin, uint256 sellerMargin` (public)

Initializes ticker, if was not initialized and returns buyer and seller margin from cache




### <span id="SyntheticAggregator-isPool-bytes32-struct-LibDerivative-Derivative-"></span> `isPool(bytes32 _derivativeHash, struct LibDerivative.Derivative _derivative) → bool result` (public)

Checks whether `syntheticId` implements pooled logic




### <span id="SyntheticAggregator-Create-struct-LibDerivative-Derivative-bytes32-"></span> `Create(struct LibDerivative.Derivative derivative, bytes32 derivativeHash)`







## <span id="TokenMinter"></span> `TokenMinter`





- [`onlyCore()`][usingRegistry-onlyCore--]
- [`nonReentrant()`][ReentrancyGuard-nonReentrant--]
- [`isOperatorOrOwner(address _from)`][ERC721OBase-isOperatorOrOwner-address-]
- [`constructor(string _baseTokenURI, address _registry)`][TokenMinter-constructor-string-address-]
- [`mint(address _buyer, address _seller, bytes32 _derivativeHash, uint256 _quantity)`][TokenMinter-mint-address-address-bytes32-uint256-]
- [`mint(address _buyer, bytes32 _derivativeHash, uint256 _quantity)`][TokenMinter-mint-address-bytes32-uint256-]
- [`burn(address _tokenOwner, uint256 _tokenId, uint256 _quantity)`][TokenMinter-burn-address-uint256-uint256-]
- [`name()`][TokenMinter-name--]
- [`symbol()`][TokenMinter-symbol--]
- [`isApprovedOrOwner(address _spender, address _owner, uint256 _tokenId)`][TokenMinter-isApprovedOrOwner-address-address-uint256-]
- [`isOpiumSpender(address _spender)`][TokenMinter-isOpiumSpender-address-]
- [`implementsERC721()`][ERC721OBackwardCompatible-implementsERC721--]
- [`ownerOf(uint256 _tokenId)`][ERC721OBackwardCompatible-ownerOf-uint256-]
- [`balanceOf(address _owner)`][ERC721OBackwardCompatible-balanceOf-address-]
- [`tokenByIndex(uint256 _index)`][ERC721OBackwardCompatible-tokenByIndex-uint256-]
- [`tokenOfOwnerByIndex(address _owner, uint256 _index)`][ERC721OBackwardCompatible-tokenOfOwnerByIndex-address-uint256-]
- [`tokenURI(uint256 _tokenId)`][ERC721OBackwardCompatible-tokenURI-uint256-]
- [`getApproved(uint256 _tokenId)`][ERC721OBackwardCompatible-getApproved-uint256-]
- [`safeTransferFrom(address _from, address _to, uint256 _tokenId)`][ERC721OBackwardCompatible-safeTransferFrom-address-address-uint256-]
- [`safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes _data)`][ERC721OBackwardCompatible-safeTransferFrom-address-address-uint256-bytes-]
- [`transferFrom(address _from, address _to, uint256 _tokenId)`][ERC721OBackwardCompatible-transferFrom-address-address-uint256-]
- [`_checkAndCallSafeTransfer(address _from, address _to, uint256 _tokenId, bytes _data)`][ERC721OBackwardCompatible-_checkAndCallSafeTransfer-address-address-uint256-bytes-]
- [`compose(uint256[] _tokenIds, uint256[] _tokenRatio, uint256 _quantity)`][ERC721OComposable-compose-uint256---uint256---uint256-]
- [`decompose(uint256 _portfolioId, uint256[] _tokenIds, uint256[] _tokenRatio, uint256 _quantity)`][ERC721OComposable-decompose-uint256-uint256---uint256---uint256-]
- [`recompose(uint256 _portfolioId, uint256[] _initialTokenIds, uint256[] _initialTokenRatio, uint256[] _finalTokenIds, uint256[] _finalTokenRatio, uint256 _quantity)`][ERC721OComposable-recompose-uint256-uint256---uint256---uint256---uint256---uint256-]
- [`_mint(uint256 _tokenId, address _to, uint256 _supply)`][ERC721OMintable-_mint-uint256-address-uint256-]
- [`_burn(address _tokenOwner, uint256 _tokenId, uint256 _quantity)`][ERC721OMintable-_burn-address-uint256-uint256-]
- [`_mint(address _buyer, address _seller, bytes32 _derivativeHash, uint256 _quantity)`][ERC721OMintable-_mint-address-address-bytes32-uint256-]
- [`_mintLong(address _buyer, bytes32 _derivativeHash, uint256 _quantity)`][ERC721OMintable-_mintLong-address-bytes32-uint256-]
- [`_mintShort(address _seller, bytes32 _derivativeHash, uint256 _quantity)`][ERC721OMintable-_mintShort-address-bytes32-uint256-]
- [`_registerPortfolio(uint256 _portfolioId, uint256[] _tokenIds, uint256[] _tokenRatio)`][ERC721OMintable-_registerPortfolio-uint256-uint256---uint256---]
- [`batchTransferFrom(address _from, address _to, uint256[] _tokenIds, uint256[] _amounts)`][ERC721OTransferable-batchTransferFrom-address-address-uint256---uint256---]
- [`safeBatchTransferFrom(address _from, address _to, uint256[] _tokenIds, uint256[] _amounts, bytes _data)`][ERC721OTransferable-safeBatchTransferFrom-address-address-uint256---uint256---bytes-]
- [`safeBatchTransferFrom(address _from, address _to, uint256[] _tokenIds, uint256[] _amounts)`][ERC721OTransferable-safeBatchTransferFrom-address-address-uint256---uint256---]
- [`transfer(address _to, uint256 _tokenId, uint256 _amount)`][ERC721OTransferable-transfer-address-uint256-uint256-]
- [`transferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount)`][ERC721OTransferable-transferFrom-address-address-uint256-uint256-]
- [`safeTransferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount)`][ERC721OTransferable-safeTransferFrom-address-address-uint256-uint256-]
- [`safeTransferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount, bytes _data)`][ERC721OTransferable-safeTransferFrom-address-address-uint256-uint256-bytes-]
- [`_batchTransferFrom(address _from, address _to, uint256[] _tokenIds, uint256[] _amounts)`][ERC721OTransferable-_batchTransferFrom-address-address-uint256---uint256---]
- [`_transferFrom(address _from, address _to, uint256 _tokenId, uint256 _amount)`][ERC721OTransferable-_transferFrom-address-address-uint256-uint256-]
- [`_checkAndCallSafeTransfer(address _from, address _to, uint256 _tokenId, uint256 _amount, bytes _data)`][ERC721OTransferable-_checkAndCallSafeTransfer-address-address-uint256-uint256-bytes-]
- [`implementsERC721O()`][ERC721OBase-implementsERC721O--]
- [`exists(uint256 _tokenId)`][ERC721OBase-exists-uint256-]
- [`balanceOf(address _address, uint256 _tokenId)`][ERC721OBase-balanceOf-address-uint256-]
- [`totalSupply()`][ERC721OBase-totalSupply--]
- [`tokensOwned(address _owner)`][ERC721OBase-tokensOwned-address-]
- [`setApprovalForAll(address _operator, bool _approved)`][ERC721OBase-setApprovalForAll-address-bool-]
- [`approve(address _to, uint256 _tokenId)`][ERC721OBase-approve-address-uint256-]
- [`getApproved(uint256 _tokenId, address _tokenOwner)`][ERC721OBase-getApproved-uint256-address-]
- [`isApprovedForAll(address _owner, address _operator)`][ERC721OBase-isApprovedForAll-address-address-]
- [`_updateTokenBalance(address _from, uint256 _tokenId, uint256 _amount, enum ObjectLib.Operations op)`][ERC721OBase-_updateTokenBalance-address-uint256-uint256-enum-ObjectLib-Operations-]
- [`supportsInterface(bytes4 interfaceId)`][ERC165-supportsInterface-bytes4-]
- [`_registerInterface(bytes4 interfaceId)`][ERC165-_registerInterface-bytes4-]
- [`RegistrySet(address registry)`][usingRegistry-RegistrySet-address-]
- [`Transfer(address from, address to, uint256 tokenId)`][IERC721-Transfer-address-address-uint256-]
- [`Approval(address owner, address approved, uint256 tokenId)`][IERC721-Approval-address-address-uint256-]
- [`ApprovalForAll(address owner, address operator, bool approved)`][IERC721-ApprovalForAll-address-address-bool-]
- [`TransferWithQuantity(address from, address to, uint256 tokenId, uint256 quantity)`][IERC721O-TransferWithQuantity-address-address-uint256-uint256-]
- [`BatchTransfer(address from, address to, uint256[] tokenTypes, uint256[] amounts)`][IERC721O-BatchTransfer-address-address-uint256---uint256---]
- [`Composition(uint256 portfolioId, uint256[] tokenIds, uint256[] tokenRatio)`][IERC721O-Composition-uint256-uint256---uint256---]

### <span id="TokenMinter-constructor-string-address-"></span> `constructor(string _baseTokenURI, address _registry)` (public)

Calls constructors of super-contracts




### <span id="TokenMinter-mint-address-address-bytes32-uint256-"></span> `mint(address _buyer, address _seller, bytes32 _derivativeHash, uint256 _quantity)` (external)

Mints LONG and SHORT position tokens




### <span id="TokenMinter-mint-address-bytes32-uint256-"></span> `mint(address _buyer, bytes32 _derivativeHash, uint256 _quantity)` (external)

Mints only LONG position tokens for "pooled" derivatives




### <span id="TokenMinter-burn-address-uint256-uint256-"></span> `burn(address _tokenOwner, uint256 _tokenId, uint256 _quantity)` (external)

Burns position tokens




### <span id="TokenMinter-name--"></span> `name() → string` (external)

ERC721 interface compatible function for position token name retrieving




### <span id="TokenMinter-symbol--"></span> `symbol() → string` (external)

ERC721 interface compatible function for position token symbol retrieving




### <span id="TokenMinter-isApprovedOrOwner-address-address-uint256-"></span> `isApprovedOrOwner(address _spender, address _owner, uint256 _tokenId) → bool` (public)

VIEW FUNCTIONS
Checks whether _spender is approved to spend tokens on _owners behalf or owner itself




### <span id="TokenMinter-isOpiumSpender-address-"></span> `isOpiumSpender(address _spender) → bool` (public)

Checks whether _spender is Opium.TokenSpender






## <span id="TokenSpender"></span> `TokenSpender`





- [`onlyGovernor()`][WhitelistedWithGovernance-onlyGovernor--]
- [`onlyWhitelisted()`][Whitelisted-onlyWhitelisted--]
- [`constructor(address _governor)`][TokenSpender-constructor-address-]
- [`claimTokens(contract IERC20 token, address from, address to, uint256 amount)`][TokenSpender-claimTokens-contract-IERC20-address-address-uint256-]
- [`claimPositions(contract IERC721O token, address from, address to, uint256 tokenId, uint256 amount)`][TokenSpender-claimPositions-contract-IERC721O-address-address-uint256-uint256-]
- [`proposeTimelock(uint256 _timelock)`][WhitelistedWithGovernanceAndChangableTimelock-proposeTimelock-uint256-]
- [`commitTimelock()`][WhitelistedWithGovernanceAndChangableTimelock-commitTimelock--]
- [`proposeWhitelist(address[] _whitelist)`][WhitelistedWithGovernance-proposeWhitelist-address---]
- [`commitWhitelist()`][WhitelistedWithGovernance-commitWhitelist--]
- [`setGovernor(address _governor)`][WhitelistedWithGovernance-setGovernor-address-]
- [`getWhitelist()`][Whitelisted-getWhitelist--]
- [`Proposed(uint256 timelock)`][WhitelistedWithGovernanceAndChangableTimelock-Proposed-uint256-]
- [`Committed(uint256 timelock)`][WhitelistedWithGovernanceAndChangableTimelock-Committed-uint256-]
- [`GovernorSet(address governor)`][WhitelistedWithGovernance-GovernorSet-address-]
- [`Proposed(address[] whitelist)`][WhitelistedWithGovernance-Proposed-address---]
- [`Committed(address[] whitelist)`][WhitelistedWithGovernance-Committed-address---]

### <span id="TokenSpender-constructor-address-"></span> `constructor(address _governor)` (public)

Calls constructors of super-contracts




### <span id="TokenSpender-claimTokens-contract-IERC20-address-address-uint256-"></span> `claimTokens(contract IERC20 token, address from, address to, uint256 amount)` (external)

Using this function whitelisted contracts could call ERC20 transfers




### <span id="TokenSpender-claimPositions-contract-IERC721O-address-address-uint256-uint256-"></span> `claimPositions(contract IERC721O token, address from, address to, uint256 tokenId, uint256 amount)` (external)

Using this function whitelisted contracts could call ERC721O transfers





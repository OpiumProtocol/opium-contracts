# Ganache
npx ganache-cli -f https://eth-mainnet.alchemyapi.io/v2/YBnVpX5PA2hL9zhdraEXTY-rr_djThv7 -u "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503" -u "0xF80D12E55F6cdA587a26a05f2e6477054e8255e5"

# Test
truffle test ./test/UpgradeCorePost.js --network=ganacheMainnet --reset

# Migration
truffle migrate --network=ganacheMainnet --reset
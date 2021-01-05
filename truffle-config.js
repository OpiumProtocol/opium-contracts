module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },

        ganache: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
        },

        ganacheMainnet: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            gasPrice: 100e9
        },
    },

    mocha: {
        reporter: 'eth-gas-reporter'
    },

    compilers: {
        solc: {
            version: '0.5.16',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
            }
        }
    }
}

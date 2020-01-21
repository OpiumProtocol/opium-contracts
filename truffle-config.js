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

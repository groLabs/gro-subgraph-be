export const NA = 'N/A';
export const PORT = 3015;
export const TX_ITERATION = 800; // # of records retrieved per subgraph call (limited to 1000 per call)
export const LAUNCH_TIMESTAMP_ETH = '1622204347';
export const LAUNCH_TIMESTAMP_AVAX = '1638483222';
export const SUBGRAPH_URL = {
    UNKNOWN: {
        ETH: 'tbc',
        AVAX: 'tbc',
    },
    PROD_HOSTED: {
        ETH: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-eth',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-avax',
    },
    PROD_STUDIO: {
        ETH: 'https://api.studio.thegraph.com/query/35003/gro-mainnet/v0.0.5c',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-avax', // (1)
    },
    TEST_HOSTED: {
        ETH: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-test-eth',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-test-avax',
    },
    TEST_STUDIO: {
        ETH: 'tbc',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-test-avax', // (1)
    }
    // (1): To be updated when Avalanche network goes decentralised
}

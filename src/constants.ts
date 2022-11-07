import { Token } from './types';

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

export const STABLECOINS = [
    Token.DAI,
    Token.USDC,
    Token.USDT,
];

export const DEFAULT_STRATEGY_APY = new Map<string, number>([
    ['0xdea436e15b40e7b707a7002a749f416dfe5b383f', 0.05],   // FRAX
    ['0x4d5b5376cbcc001bb4f8930208828ab87d121da8', 0.05],   // mUSD
    ['0xd370998b2e7941151e7bb9f6e337a12f337d0682', 0.023],  // gUSD
    ['0x8b335d3e266389ae08a2f22b01d33813d40ed8fd', 0.09],   // alUSD
    ['0xde5a25415c637b52d59ef980b29a5fda8dc3c70b', 0.04],   // TUSD
]);

export const NA = 'N/A';
export const PORT = 3015;
export const TX_ITERATION = 800; // # of records retrieved per subgraph call (limited to 1000 per call)
export const MAX_VEST_TIME = 31556952;
export const LAUNCH_TIMESTAMP_ETH = '1622204347';
export const LAUNCH_TIMESTAMP_AVAX = '1638483222';
export const TS_1D = 86400;             // One day
export const TS_7D = 604800;            // Seven days
export const TS_15D = 1296000;          // Fifteen days

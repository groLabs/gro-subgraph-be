import { config } from 'dotenv';
config();

export const NA = 'N/A';
export const PWRD_APY = 0.02;
export const QUERY_ERROR = 400;
export const QUERY_SUCCESS = 200;
export const TX_ITERATION = 999; // # of records retrieved per subgraph call (limited to 1000 per call)
export const NUM_TRANSFER_CHECKS = 3; // # of TransferTx to be checked in getPersonalStats() when records > TX_ITERATION
export const MAX_VEST_TIME = 31556952;
export const LAUNCH_TIMESTAMP_ETH = '1622204347';
export const LAUNCH_TIMESTAMP_AVAX = '1638483222';
export const TS_1D = 86400;     // one day
export const TS_7D = 604800;    // seven days
export const TS_15D = 1296000;  // fifteen days
export const DECIMALS = 7;
export const BLOCKS_PER_YEAR = 2252571;
export const PWRD_TVL_CORRECTION = 432.5559;  // correction due to rebasing (as of Nov'22)

// UST Vesting Airdrop
const ONE_MONTH_SECONDS = 2629746; // average year (including leap years) in seconds / 12
export const UST_VESTING_AIRDROP = {
    START_TIME: 1656654244,
    END_TIME: 1717138402,
    VESTING_TIME: ONE_MONTH_SECONDS * 23, // 2 years period - 1 month
}

// Post-G2 strategies: average of the estimated APY from the Convex pools as of 17.04.23
export const DEFAULT_STRATEGY_APY = new Map<string, number>([
    ['0x60a6a86ad77ef672d93db4408d65cf27dd627050', 0.0308],  // FRAX
    ['0x4d81d0c2655d8d5fdee83dbb16e6b899ec276fac', 0.0019],  // LUSD
    ['0x73703f0493c08ba592ab1e321bead695ac5b39e3', 0.00023],  // OUSD
    ['0xa522b13fef6161c570ff765c986cb9992a89c786', 0.0352],  // TUSD
]);
export const DEFAULT_AVERAGE_STRATEGY_APY =
    0.0308 * 0.25       // FRAX
    + 0.0019 * 0.25     // LUSD
    + 0.00023 * 0.25    // OUSD
    + 0.0352 * 0.25;    // TUSD

// Discord channels (TEST & PROD must have the same children alerts and aligned with type DiscordAlert)
export const DISCORD_CHANNELS = {
    'PROD': {
        'BOT_ALERT':
            process.env.DISCORD_PROD_BOT_ALERT,
        'BOT_LOG':
            process.env.DISCORD_PROD_BOT_LOG,
        'CRIT_ACTION':
            process.env.DISCORD_PROD_CRIT_ACTION,
    },
    'TEST': {
        'BOT_ALERT':
            process.env.DISCORD_TEST_BOT_ALERT,
        'BOT_LOG':
            process.env.DISCORD_TEST_BOT_LOG,
        'CRIT_ACTION':
            process.env.DISCORD_TEST_BOT_LOG,
    },
}

export const SUBGRAPH_LOGO_URL = process.env.SUBGRAPH_LOGO_URL;












// G2 strategies v1
/*
export const DEFAULT_STRATEGY_APY = new Map<string, number>([
    ['0xd18415e9bc188f113cb54a9edd86df21898555c7', 0.0293],  // FRAX
    ['0x708d0089d52d57e911024465e841774634466608', 0.0174],  // LUSD
    ['0xa1327c0cd1e04e82fd99e68b46ab8a6eb15b17ae', 0.0390],  // GUSD
    ['0xd947957dea1112cc9d7a5111ea6459432737e4c2', 0.0221],  // OUSD
    ['0xd849d8551ec988a59d4e411b1ed7b5b40bf97159', 0.0382],  // TUSD
]);
export const DEFAULT_AVERAGE_STRATEGY_APY =
      0.0293 * 0.25       // FRAX
    + 0.0174 * 0.12     // LUSD
    + 0.0390 * 0.13     // GUSD
    + 0.0221 * 0.25     // OUSD
    + 0.0382 * 0.25;    // TUSD
*/

// Pre-G2 strategies
/*
export const DEFAULT_STRATEGY_APY = new Map<string, number>([
    ['0xdea436e15b40e7b707a7002a749f416dfe5b383f', 0.05],   // FRAX
    ['0xd1b9af64ed5cdcaeb58955d82fb384b3e558df7b', 0.02],   // FRAX
    ['0x4d5b5376cbcc001bb4f8930208828ab87d121da8', 0.04],   // mUSD->TUSD
    ['0xd370998b2e7941151e7bb9f6e337a12f337d0682', 0.023],  // gUSD
    ['0x8b335d3e266389ae08a2f22b01d33813d40ed8fd', 0.09],   // alUSD
    ['0xde5a25415c637b52d59ef980b29a5fda8dc3c70b', 0.06],   // TUSD->oUSD
]);
*/

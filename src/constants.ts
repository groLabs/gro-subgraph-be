export const NA = 'N/A';
export const PWRD_APY = 0.02;
export const QUERY_ERROR = 400;
export const QUERY_SUCCESS = 200;
export const TX_ITERATION = 999; // # of records retrieved per subgraph call (limited to 1000 per call)
export const MAX_VEST_TIME = 31556952;
export const LAUNCH_TIMESTAMP_ETH = '1622204347';
export const LAUNCH_TIMESTAMP_AVAX = '1638483222';
export const TS_1D = 86400;     // one day
export const TS_7D = 604800;    // seven days
export const TS_15D = 1296000;  // fifteen days
export const DECIMALS = 7;
export const BLOCKS_PER_YEAR = 2252571;
export const PWRD_TVL_CORRECTION = 432.5559;  // correction due to rebasing (as of Nov'22)
// Post-G2 strategies
export const DEFAULT_STRATEGY_APY = new Map<string, number>([
    ['0xd18415e9bc188f113cb54a9edd86df21898555c7', 0.05],  // FRAX
    ['0x708d0089d52d57e911024465e841774634466608', 0.03],  // LUSD
    ['0xa1327c0cd1e04e82fd99e68b46ab8a6eb15b17ae', 0.03],  // GUSD
    ['0xd947957dea1112cc9d7a5111ea6459432737e4c2', 0.03],  // OUSD
    ['0xd849d8551ec988a59d4e411b1ed7b5b40bf97159', 0.03],  // TUSD
    // ['0xaeeed92f98e3362c49b2111388715354bf838c03', 0.03],  // MIM
]);
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

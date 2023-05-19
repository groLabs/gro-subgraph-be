import { toStr } from './utils';
import { IApy } from '../interfaces/groStats/ethereum/IApy';
import { IGvtApy } from '../interfaces/groStats/ethereum/IGvtApy';
import { IBlockNumbers } from '../interfaces/blockNumbers/IBlockNumbers';
import {
    PWRD_APY,
    DAYS_GVT_APY,
    DEFAULT_AVERAGE_STRATEGY_APY,
} from '../constants';


/// @notice Default values (avoid division by 0)
const rekt: IApy = {
    'current': {
        'pwrd': toStr(0),
        'gvt': toStr(0),
    }
}

/// @notice Calculates the core APY for GVT tranche based on gvault harvest events [currently not used]
/// @dev Fixed PWRD APY in G^2; other gains/losses goes to gvt
/// @dev If no tranche APY (e.g.: GoLive + migration with no harvests yet), 
//       set tranche APY to average Convex strategies APY
/// @param tvlGvt The total value locked in GVT
/// @param tvlPwrd The total value locked in PWRD
/// @param trancheApy The APY for the current tranche
/// @return An object containing the calculated APYs for PWRD and GVT tranches
export const getCoreApy = (
    tvlGvt: number,
    tvlPwrd: number,
    trancheApy: number,
): IApy => {
    const u = (tvlGvt > 0) ? tvlPwrd / tvlGvt : 0;
    if (u === 0) {
        return rekt;
    } else if (trancheApy === 0) {
        trancheApy = DEFAULT_AVERAGE_STRATEGY_APY;
    }
    const gvt = trancheApy * (1 + u) - (PWRD_APY * u)
    return {
        'current': {
            'pwrd': toStr(PWRD_APY),
            'gvt': toStr(gvt),
        }
    }
}

/// @notice Calculates the core APY for GVT tranche based on gvt price per share comparison [currently used]
/// @dev Fixed PWRD APY in G^2; other gains/losses goes to gvt
/// @param gvtPrice The gvt price per share now
/// @param gvtPriceNdaysAgo The gvt price per share N days ago, where N is defined in DAYS_GVT_APY
/// @return An object containing the calculated APYs for PWRD and GVT tranches
export const getCoreApyPps = (
    gvtPrice: number,
    gvtPriceNdaysAgo: number,
): IApy => {
    const gvtApy = (1 + ((gvtPrice - gvtPriceNdaysAgo) / gvtPriceNdaysAgo)) ** (365 / DAYS_GVT_APY) - 1;
    return {
        'current': {
            'pwrd': toStr(PWRD_APY),
            'gvt': toStr(gvtApy),
        }
    }
}

/// @notice Parses gvt prices and block data into a checksum object to be able to understand how the 
///         gvt apy was calculated
/// @param gvtPrice The gvt price per share now
/// @param gvtPriceNdaysAgo The gvt price per share N days ago, where N is defined in DAYS_GVT_APY
/// @param blocks The blocks data containing essentially latest block number and block number N days ago
/// @return An object containing the overall gvt apy data
export const checksumGvtApy = (
    gvtPrice: string,
    gvtPriceNdaysAgo: string,
    blocks: IBlockNumbers,
): IGvtApy => {
    return {
        'gvt_price': gvtPrice,
        'gvt_price_ndays_ago': gvtPriceNdaysAgo,
        'days': DAYS_GVT_APY,
        'latestBlockNumber': blocks.latestBlockNumber,
        'blockNumberNDaysAgo': blocks.blockNumberNDaysAgo,
        'lastExecutionTimestamp': blocks.lastExecutionTimestamp,
        'status': blocks.status,
    }
}

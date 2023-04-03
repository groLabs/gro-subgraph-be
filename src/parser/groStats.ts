import { NA } from '../constants';
import { toStr } from '../utils/utils';
import {
    Status,
    NetworkName,
} from '../types';
import {
    IGroStats,
    IGroStatsEthereum,
    IGroStatsAvalanche,
} from '../interfaces/groStats/IGroStats';


/// @notice Parses and aggregates Gro protocol statistics from Ethereum and Avalanche networks
/// @param stats_eth The IGroStatsEthereum object containing Gro protocol statistics for the Ethereum network
/// @param stats_avax The IGroStatsAvalanche object containing Gro protocol statistics for the Avalanche network
/// @return An IGroStats object containing the combined statistics and total TVL for both networks
export const groStatsParser = (
    stats_eth: IGroStatsEthereum,
    stats_avax: IGroStatsAvalanche,
): IGroStats => {
    // calc total tvl
    let totalTVL = NA;
    let ethTVL = NA;
    let avaxTVL = NA;
    if (stats_eth.tvl.total && stats_avax.tvl.total) {
        ethTVL = stats_eth.tvl.total;
        avaxTVL = stats_avax.tvl.total;
        totalTVL = toStr(parseFloat(stats_eth.tvl.total) + parseFloat(stats_avax.tvl.total));
    }
    const result = {
        'gro_stats_mc': {
            'status': (
                stats_eth.status === Status.OK
                && stats_avax.status === Status.OK)
                ? Status.OK
                : Status.ERROR,
            'error_msg': '',
            'current_timestamp': stats_eth.current_timestamp,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'tvl': {
                    'mainnet': ethTVL,
                    'avalanche': avaxTVL,
                    'total': totalTVL,
                }
            },
            'mainnet': stats_eth,
            'avalanche': stats_avax,
        }
    }
    return result;
}

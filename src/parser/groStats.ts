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

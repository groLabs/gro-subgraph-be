import { Status } from '../../types';
import { showError } from '../../handler/logHandler';
import { personalStatsError } from './personalStatsError';
import {
    now,
    toStr
} from '../../utils/utils';
import {
    IPersonalStatsEthereum,
    IPersonalStatsAvalanche,
    IPersonalStatsTotals,
} from '../../interfaces/personalStats/IPersonalStats';


/// @notice Combines personal stats from the Ethereum and Avalanche subgraphs into a single 
///         IPersonalStatsTotals object
/// @param stats_eth The parsed IPersonalStatsEthereum object containing Ethereum subgraph data
/// @param stats_avax The parsed IPersonalStatsAvalanche object containing Avalanche subgraph data
/// @return An IPersonalStatsTotals object containing the combined data from Ethereum and
///         Avalanche subgraphs
export const personalStatsSubgraphParserTotals = (
    stats_eth: IPersonalStatsEthereum,
    stats_avax: IPersonalStatsAvalanche,
): IPersonalStatsTotals => {
    try {
        const isMaintenance = (stats_avax.status === Status.WARNING) ? true : false;
        const status = (isMaintenance)
            ? Status.WARNING
            : (stats_eth.status === Status.OK && stats_avax.status === Status.OK)
                ? Status.OK
                : Status.ERROR;
        const error_msg = isMaintenance
            ? `Maintenance in TheGraph's hosted service currently underway`
            : '';

        const personalStats = {
            'gro_personal_position_mc': {
                'status': status,
                'error_msg': error_msg,
                'current_timestamp': stats_eth.current_timestamp,
                'address': stats_eth.address,
                'network': stats_eth.network,
                'mc_totals': {
                    'amount_added': {
                        'ethereum': stats_eth.amount_added.total,
                        'avalanche': stats_avax.amount_added.total,
                        'total': toStr(
                            parseFloat(stats_eth.amount_added.total)
                            + (!isMaintenance ? parseFloat(stats_avax.amount_added.total) : 0)
                        )
                    },
                    'amount_removed': {
                        'ethereum': stats_eth.amount_removed.total,
                        'avalanche': stats_avax.amount_removed.total,
                        'total': toStr(
                            parseFloat(stats_eth.amount_removed.total)
                            + (!isMaintenance ? parseFloat(stats_avax.amount_removed.total) : 0)
                        )
                    },
                    'net_amount_added': {
                        'ethereum': stats_eth.net_amount_added.total,
                        'avalanche': stats_avax.net_amount_added.total,
                        'total': toStr(
                            parseFloat(stats_eth.net_amount_added.total)
                            + (!isMaintenance ? parseFloat(stats_avax.net_amount_added.total) : 0)
                        )
                    },
                    'current_balance': {
                        'ethereum': stats_eth.current_balance.total,
                        'avalanche': stats_avax.current_balance.total,
                        'total': toStr(
                            parseFloat(stats_eth.current_balance.total)
                            + (!isMaintenance ? parseFloat(stats_avax.current_balance.total) : 0)
                        )
                    },
                    'net_returns': {
                        'ethereum': stats_eth.net_returns.total,
                        'avalanche': stats_avax.net_returns.total,
                        'total': toStr(
                            parseFloat(stats_eth.net_returns.total)
                            + (!isMaintenance ? parseFloat(stats_avax.net_returns.total) : 0)
                        )
                    },
                },
                'ethereum': stats_eth,
                'avalanche': stats_avax,
            }
        }
        return personalStats;
    } catch (err) {
        showError(
            'parser/personalStatsTotals.ts->personalStatsSubgraphParserTotals()',
            `${err}`,
        );
        return personalStatsError(
            now(),
            (stats_eth.address) ? stats_eth.address : 'unknown address',
            err as string,
        );
    }
}

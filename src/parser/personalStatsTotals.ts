import moment from 'moment';
import { showError } from '../handler/logHandler';
import {
    IPersonalStatsEthereum,
    IPersonalStatsAvalanche,
    IPersonalStatsTotals,
} from '../interfaces/IPersonalStats';
import { Status } from '../types';
import { personalStatsError } from './personalStatsError';

export const personalStatsSubgraphParserTotals = (
    stats_eth: IPersonalStatsEthereum,
    stats_avax: IPersonalStatsAvalanche,
): IPersonalStatsTotals => {
    try {
        const personalStats = {
            "gro_personal_position_mc": {
                "status": (
                    stats_eth.status === 'ok'
                    && stats_avax.status === 'ok')
                    ? Status.ok
                    : Status.error,
                "current_timestamp": stats_eth.current_timestamp,
                "address": stats_eth.address,
                "network": stats_eth.network,
                "mc_totals": {
                    "amount_added": {
                        "ethereum": stats_eth.amount_added.total,
                        "avalanche": stats_avax.amount_added.total,
                        "total": (
                            parseFloat(stats_eth.amount_added.total)
                            + parseFloat(stats_avax.amount_added.total)
                        ).toString()
                    },
                    "amount_removed": {
                        "ethereum": stats_eth.amount_removed.total,
                        "avalanche": stats_avax.amount_removed.total,
                        "total": (
                            parseFloat(stats_eth.amount_removed.total)
                            + parseFloat(stats_avax.amount_removed.total)
                        ).toString()
                    },
                    "net_amount_added": {
                        "ethereum": stats_eth.net_amount_added.total,
                        "avalanche": stats_avax.net_amount_added.total,
                        "total": (
                            parseFloat(stats_eth.net_amount_added.total)
                            + parseFloat(stats_avax.net_amount_added.total)
                        ).toString()
                    },
                    "current_balance": {
                        "ethereum": stats_eth.current_balance.total,
                        "avalanche": stats_avax.current_balance.total,
                        "total": (
                            parseFloat(stats_eth.current_balance.total)
                            + parseFloat(stats_avax.current_balance.total)
                        ).toString()
                    },
                    "net_returns": {
                        "ethereum": stats_eth.net_returns.total,
                        "avalanche": stats_avax.net_returns.total,
                        "total": (
                            parseFloat(stats_eth.net_returns.total)
                            + parseFloat(stats_avax.net_returns.total)
                        ).toString()
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
            moment().unix().toString(),
            stats_eth.address || 'unknown address'
        );
    }
}

import { showError } from '../handler/logHandler';

export const personalStatsSubgraphParserTotals = (
    stats_eth: any,
    stats_avax: any,
) => {
    try {
        const personalStats = {
            "gro_personal_position_mc": {
                "status": (
                    stats_eth.ethereum.status === 'ok'
                    && stats_avax.avalanche.status === 'ok')
                    ? 'ok'
                    : 'error',
                "current_timestamp": stats_eth.ethereum.current_timestamp,
                "address": stats_eth.ethereum.address,
                "network": stats_eth.ethereum.network,
                "mc_totals": {
                    "amount_added": {
                        "ethereum": stats_eth.ethereum.amount_added.total,
                        "avalanche": stats_avax.avalanche.amount_added.total,
                        "total": (
                            parseFloat(stats_eth.ethereum.amount_added.total)
                            + parseFloat(stats_avax.avalanche.amount_added.total)
                        ).toString()
                    },
                    "amount_removed": {
                        "ethereum": stats_eth.ethereum.amount_removed.total,
                        "avalanche": stats_avax.avalanche.amount_removed.total,
                        "total": (
                            parseFloat(stats_eth.ethereum.amount_removed.total)
                            + parseFloat(stats_avax.avalanche.amount_removed.total)
                        ).toString()
                    },
                    "net_amount_added": {
                        "ethereum": stats_eth.ethereum.net_amount_added.total,
                        "avalanche": stats_avax.avalanche.net_amount_added.total,
                        "total": (
                            parseFloat(stats_eth.ethereum.net_amount_added.total)
                            + parseFloat(stats_avax.avalanche.net_amount_added.total)
                        ).toString()
                    },
                    "current_balance": {
                        "ethereum": stats_eth.ethereum.current_balance.total,
                        "avalanche": stats_avax.avalanche.current_balance.total,
                        "total": (
                            parseFloat(stats_eth.ethereum.current_balance.total)
                            + parseFloat(stats_avax.avalanche.current_balance.total)
                        ).toString()
                    },
                    "net_returns": {
                        "ethereum": stats_eth.ethereum.net_returns.total,
                        "avalanche": stats_avax.avalanche.net_returns.total,
                        "total": (
                            parseFloat(stats_eth.ethereum.net_returns.total)
                            + parseFloat(stats_avax.avalanche.net_returns.total)
                        ).toString()
                    },
                    ...stats_eth,
                    ...stats_avax
                }
            }
        }
        return personalStats;
    } catch (err) {
        showError(
            'personalStatsSubgraphParserTotals.ts->personalStatsSubgraphParserTotals()',
            `${err}`,
        );
        //TODO: return error in json format
    }
}
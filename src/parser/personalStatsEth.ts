import { showError } from '../handler/logHandler';
import { TransferTx } from '../interfaces/IPersonalStats';
import { NO_ETH_USER } from './personalStatsEmpty'


const getPoolData = (poolId: number, stats_eth: any) => {
    const pool = stats_eth.users[0][`pool_${poolId}`];
    const isData = (pool.length > 0) ? true : false;
    return {
        "net_reward": isData ? pool[0].net_reward : '0',
        "balance": isData ? pool[0].balance : '0',
        "rewards": {
            "claim_now": "N/A",
            "vest_all": "N/A"
        }
    }
}

const getAllPoolsData = (stats_eth: any) => {
    let net_reward = 0;
    let balance = 0;
    for (let i=0; i<=6; i += 1) {
        const pool = getPoolData(i, stats_eth);
        net_reward += parseFloat(pool.net_reward);
        balance += parseFloat(pool.balance);
    }
    return {
        "net_reward": net_reward.toString(),
        "balance": balance.toString(),
        "rewards": {
            "claim_now": "N/A",
            "vest_all": "N/A"
        }
    }
}

export const parsePersonalStatsSubgraphEthereum = (
    account: string,
    stats_eth: any
) => {
    try {
        const currentTimestamp = stats_eth._meta.block.timestamp;
        if (stats_eth.users.length === 0)
            return NO_ETH_USER(
                currentTimestamp,
                account
            );

        const md_eth = stats_eth.masterDatas[0];
        const totals_eth = stats_eth.users[0].totals;
        const transfers_eth = stats_eth.users[0].transfers;
        const approvals_eth = stats_eth.users[0].approvals;

        // Pre-calculations
        const currentBalancePwrd = parseFloat(totals_eth.net_based_amount_pwrd) / parseFloat(stats_eth.factors[0].pwrd);
        const currentBalanceGvt = parseFloat(totals_eth.net_amount_gvt) * parseFloat(stats_eth.prices[0].gvt);
        const currentBalanceTotal = currentBalancePwrd + currentBalanceGvt;
        const netReturnsPwrd = currentBalancePwrd - parseFloat(totals_eth.net_value_pwrd);
        const netReturnsGvt = currentBalanceGvt - parseFloat(totals_eth.net_value_gvt);
        const netReturnsTotal = netReturnsPwrd + netReturnsGvt;

        const onlyGtoken = (item: string) => ['gvt', 'pwrd'].includes(item) ? true : false;

        const result = {
            "ethereum": {
                "status": md_eth.status,
                "network_id": md_eth.networkId,
                "network": md_eth.networkName,
                "launch_timestamp": md_eth.launchTimestamp,
                "current_timestamp": currentTimestamp,
                "address": stats_eth.users[0].address,
                "airdrops": [],
                "amount_added": {
                    "pwrd": totals_eth.value_added_pwrd,
                    "gvt": totals_eth.value_added_gvt,
                    "total": totals_eth.value_added_total,
                },
                "amount_removed": {
                    "pwrd": totals_eth.value_removed_pwrd,
                    "gvt": totals_eth.value_removed_gvt,
                    "total": totals_eth.value_removed_total,
                },
                "net_amount_added": {
                    "pwrd": totals_eth.net_value_pwrd,
                    "gvt": totals_eth.net_value_gvt,
                    "total": totals_eth.net_value_total,
                },
                "current_balance": {
                    "pwrd": currentBalancePwrd.toString(),
                    "gvt": currentBalanceGvt.toString(),
                    "total": currentBalanceTotal.toString(),
                },
                "net_returns": {
                    "pwrd": netReturnsPwrd.toString(),
                    "gvt": netReturnsGvt.toString(),
                    "total": netReturnsTotal.toString(),
                },
                "net_returns_ratio": {
                    "pwrd": "N/A",
                    "gvt": "N/A",
                    "total": "N/A"
                },
                "transaction": {
                    "deposits": transfers_eth.filter((item: TransferTx) => (
                        item.type === 'core_deposit'
                        && onlyGtoken(item.token)
                    )),
                    "withdrawals": transfers_eth.filter((item: TransferTx) => (
                        item.type === 'core_withdrawal'
                        && onlyGtoken(item.token)
                    )),
                    "transfers_in": transfers_eth.filter((item: TransferTx) => (
                        item.type === 'transfer_in'
                        && onlyGtoken(item.token)
                    )),
                    "transfers_out": transfers_eth.filter((item: TransferTx) => (
                        item.type === 'transfer_out'
                        && onlyGtoken(item.token)
                    )),
                    "approvals": approvals_eth.filter((item: TransferTx) =>
                        onlyGtoken(item.token)
                    ),
                    "failures": []
                },
                "vest_bonus": {
                    "locked_gro": "N/A",
                    "net_reward": "N/A",
                    "rewards": {
                        "claim_now": "N/A",
                        "vest_all": "N/A"
                    }
                },
                "pools": {
                    "all": getAllPoolsData(stats_eth),
                    "single_staking_100_gro_0": getPoolData(0, stats_eth),
                    "uniswap_v2_5050_gro_gvt_1": getPoolData(1, stats_eth),
                    "uniswap_v2_5050_gro_usdc_2": getPoolData(2, stats_eth),
                    "single_staking_100_gvt_3": getPoolData(3, stats_eth),
                    "curve_meta_pwrd_3crv_4": getPoolData(4, stats_eth),
                    "balancer_v2_8020_gro_weth_5": getPoolData(5, stats_eth),
                    "single_staking_100_pwrd_6": getPoolData(6, stats_eth)
                },
                "gro_balance_combined": "N/A",
                "vesting_airdrop": {
                    "name": "N/A",
                    "token": "N/A",
                    "amount": "0.00",
                    "claim_initialized": "N/A",
                    "claimed_amount": "0.00",
                    "claimable_amount": "0.00",
                    "proofs": []
                }
            },
        }
        //console.dir(result, { depth: null });
        return result;

    } catch (err) {
        showError(
            'personalStatsSubgraphParserEth.ts->parsePersonalStatsSubgraphEthereum()',
            `${err}`,
        );
        return NO_ETH_USER;
    }
}

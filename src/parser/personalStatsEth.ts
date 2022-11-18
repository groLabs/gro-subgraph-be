import { NA } from '../constants';
import { showError } from '../handler/logHandler';
import { getVestingBonus } from '../utils/vesting';
import { emptyEthUser } from './personalStatsEmpty';
import { IPool } from '../interfaces/personalStats/IPool';
import { ITransferTx } from '../interfaces/personalStats/ITransferTx';
import { IApprovalTx } from '../interfaces/personalStats/IApprovalTx';
import { IPersonalStatsEthereum } from '../interfaces/personalStats/IPersonalStats';
import {
    now,
    toStr
} from '../utils/utils';
import {
    Status,
    NetworkId,
    NetworkName,
} from '../types';
import {
    getPool,
    getAllPools,
    getGroBalanceCombined,
} from '../utils/staker';


export const parsePersonalStatsSubgraphEthereum = (
    account: string,
    stats_eth: any
): IPersonalStatsEthereum => {
    try {
        // console.dir(stats_eth, { depth: null });
        const currentTimestamp = stats_eth._meta.block.timestamp;
        if (stats_eth.users.length === 0 || stats_eth.prices.length === 0)
            return emptyEthUser(
                currentTimestamp,
                account,
                Status.OK,
            );

        const md_eth = stats_eth.masterDatas[0];
        const totals_eth = stats_eth.users[0].totals;
        const transfers_eth: ITransferTx[] = stats_eth.users[0].transfers;
        const approvals_eth: IApprovalTx[] = stats_eth.users[0].approvals;

        // Pre-calculations
        const currentBalancePwrd = parseFloat(totals_eth.net_based_amount_pwrd) / parseFloat(stats_eth.factors[0].pwrd);
        const currentBalanceGvt = parseFloat(totals_eth.net_amount_gvt) * parseFloat(stats_eth.prices[0].gvt);
        const currentBalanceTotal = currentBalancePwrd + currentBalanceGvt;
        const netReturnsPwrd = currentBalancePwrd - parseFloat(totals_eth.net_value_pwrd);
        const netReturnsGvt = currentBalanceGvt - parseFloat(totals_eth.net_value_gvt);
        const netReturnsTotal = netReturnsPwrd + netReturnsGvt;
        let pools: IPool[] = [];
        pools[0] = getPool(0, stats_eth);
        pools[1] = getPool(1, stats_eth);
        pools[2] = getPool(2, stats_eth);
        pools[3] = getPool(3, stats_eth);
        pools[4] = getPool(4, stats_eth);
        pools[5] = getPool(5, stats_eth);
        pools[6] = getPool(6, stats_eth);
        const allPools: IPool = getAllPools(pools);
        const totalGro = stats_eth.users[0].vestingBonus.vesting_gro
        const netReward =  stats_eth.users[0].vestingBonus.net_reward;
        const latestStartTime = stats_eth.users[0].vestingBonus.latest_start_time
        const groBalanceCombined = getGroBalanceCombined(
            parseFloat(totals_eth.amount_total_gro),
            parseFloat(totalGro),
            parseFloat(totals_eth.amount_total_gro_team),
            pools,
            stats_eth.poolDatas,
        );

        const onlyGtoken = (item: string) => ['gvt', 'pwrd'].includes(item) ? true : false;

        const result = {
            "status": md_eth.status as Status,
            "network_id": md_eth.networkId.toString() as NetworkId,
            "network": md_eth.networkName as NetworkName,
            "launch_timestamp": md_eth.launchTimestamp.toString(),
            "current_timestamp": currentTimestamp.toString(),
            "address": stats_eth.users[0].address as string,
            "prices": stats_eth.prices[0],
            "airdrops": [] as [],
            "amount_added": {
                "pwrd": toStr(parseFloat(totals_eth.value_added_pwrd)),
                "gvt": toStr(parseFloat(totals_eth.value_added_gvt)),
                "total": toStr(totals_eth.value_added_total),
            },
            "amount_removed": {
                "pwrd": toStr(totals_eth.value_removed_pwrd),
                "gvt": toStr(totals_eth.value_removed_gvt),
                "total": toStr(totals_eth.value_removed_total),
            },
            "net_amount_added": {
                "pwrd": toStr(totals_eth.net_value_pwrd),
                "gvt": toStr(totals_eth.net_value_gvt),
                "total": toStr(totals_eth.net_value_total),
            },
            "current_balance": {
                "pwrd": toStr(currentBalancePwrd),
                "gvt": toStr(currentBalanceGvt),
                "total": toStr(currentBalanceTotal),
            },
            "net_returns": {
                "pwrd": toStr(netReturnsPwrd),
                "gvt": toStr(netReturnsGvt),
                "total": toStr(netReturnsTotal),
            },
            "net_returns_ratio": {
                "pwrd": NA,
                "gvt": NA,
                "total": NA
            },
            "transaction": {
                "deposits": transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'core_deposit'
                        && onlyGtoken(item.token)
                    )),
                "withdrawals": transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'core_withdrawal'
                        && onlyGtoken(item.token)
                    )),
                "transfers_in": transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'transfer_in'
                        && onlyGtoken(item.token)
                    )),
                "transfers_out": transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'transfer_out'
                        && onlyGtoken(item.token)
                    )),
                "approvals": approvals_eth
                    .filter((item: IApprovalTx) =>
                        onlyGtoken(item.token)
                    ),
                "failures": [] as []
            },
            "vest_bonus": getVestingBonus(
                parseFloat(totalGro),
                parseFloat(netReward),
                parseFloat(groBalanceCombined.total),
                currentTimestamp,
                latestStartTime,
                md_eth.total_locked_amount,
                md_eth.total_bonus,
                md_eth.global_start_time,
                parseFloat(md_eth.init_unlocked_percent),
            ),
            "pools": {
                "all": allPools,
                "single_staking_100_gro_0": pools[0],
                "uniswap_v2_5050_gro_gvt_1": pools[1],
                "uniswap_v2_5050_gro_usdc_2": pools[2],
                "single_staking_100_gvt_3": pools[3],
                "curve_meta_pwrd_3crv_4": pools[4],
                "balancer_v2_8020_gro_weth_5": pools[5],
                "single_staking_100_pwrd_6": pools[6]
            },
            "gro_balance_combined": groBalanceCombined.total,
            "gro_balance_combined_detail": groBalanceCombined.detail,
            "vesting_airdrop": {
                "name": NA,
                "token": NA,
                "amount": NA,
                "claim_initialized": NA,
                "claimed_amount": NA,
                "claimable_amount": NA,
                "proofs": [] as []
            }
        }
        //console.dir(result, { depth: null });
        return result;
    } catch (err) {
        showError('parser/personalStatsEth.ts->parsePersonalStatsSubgraphEthereum()', err);
        return emptyEthUser(
            now(),
            account,
            Status.ERROR,
        );
    }
}

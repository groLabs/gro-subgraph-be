import moment from 'moment';
import { showError } from '../handler/logHandler';
import { IPool } from '../interfaces/IPool';
import { ITransferTx } from '../interfaces/ITransferTx';
import { IApprovalTx } from '../interfaces/IApprovalTx';
import { IPersonalStatsEthereum } from '../interfaces/IPersonalStats';
import { emptyEthUser } from './personalStatsEmpty';
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
import { NA } from '../constants';


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
        const groBalanceCombined = getGroBalanceCombined(
            parseFloat(totals_eth.amount_total_gro),
            parseFloat(stats_eth.users[0].vestingBonus.vesting_gro),
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
                "pwrd": totals_eth.value_added_pwrd as string,
                "gvt": totals_eth.value_added_gvt as string,
                "total": totals_eth.value_added_total as string,
            },
            "amount_removed": {
                "pwrd": totals_eth.value_removed_pwrd as string,
                "gvt": totals_eth.value_removed_gvt as string,
                "total": totals_eth.value_removed_total as string,
            },
            "net_amount_added": {
                "pwrd": totals_eth.net_value_pwrd as string,
                "gvt": totals_eth.net_value_gvt as string,
                "total": totals_eth.net_value_total as string,
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
                "pwrd": NA,
                "gvt": NA,
                "total": NA
            },
            "transaction": {
                "deposits": transfers_eth.filter((item: ITransferTx) => (
                    item.type === 'core_deposit'
                    && onlyGtoken(item.token)
                )),
                "withdrawals": transfers_eth.filter((item: ITransferTx) => (
                    item.type === 'core_withdrawal'
                    && onlyGtoken(item.token)
                )),
                "transfers_in": transfers_eth.filter((item: ITransferTx) => (
                    item.type === 'transfer_in'
                    && onlyGtoken(item.token)
                )),
                "transfers_out": transfers_eth.filter((item: ITransferTx) => (
                    item.type === 'transfer_out'
                    && onlyGtoken(item.token)
                )),
                "approvals": approvals_eth.filter((item: IApprovalTx) =>
                    onlyGtoken(item.token)
                ),
                "failures": [] as []
            },
            "vest_bonus": {
                "locked_gro": NA,
                "net_reward": NA,
                "rewards": {
                    "claim_now": NA,
                    "vest_all": NA
                }
            },
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
            moment().unix().toString(),
            account,
            Status.ERROR,
        );
    }
}

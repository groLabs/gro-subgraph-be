import { showError } from '../handler/logHandler';
import { getAirdrops } from '../utils/airdrop';
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
    getVestingBonus,
    getVestingAirdrop,
} from '../utils/vesting';
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
        // Debug subgraph respone:
        // console.dir(stats_eth, { depth: null });

        // Very randombly the subgraph returns null timestamp although all data is fine
        // => Replaced <stats_eth._meta.block.timestamp> by <now()>
        const currentTimestamp = now();
        
        // If no user or price data, return empty user
        if (stats_eth.users.length === 0 || stats_eth.prices.length === 0)
            return emptyEthUser(
                currentTimestamp,
                account,
                Status.OK,
            );

        // Pre-calculations
        const md_eth = stats_eth.masterDatas[0];
        const totals_eth = stats_eth.users[0].totals;
        const currentBalancePwrd = parseFloat(totals_eth.net_based_amount_pwrd) / parseFloat(stats_eth.factors[0].pwrd);
        const currentBalanceGvt = parseFloat(totals_eth.net_amount_gvt) * parseFloat(stats_eth.prices[0].gvt);
        const currentBalanceTotal = currentBalancePwrd + currentBalanceGvt;
        const netReturnsPwrd = currentBalancePwrd - parseFloat(totals_eth.net_value_pwrd);
        const netReturnsGvt = currentBalanceGvt - parseFloat(totals_eth.net_value_gvt);
        const netReturnsTotal = netReturnsPwrd + netReturnsGvt;

        // Prepare datasets
        let pools: IPool[] = [];
        for (let i=0; i<7; i++) {
            pools.push(getPool(i, stats_eth));
        }
        const allPools: IPool = getAllPools(pools);
        const transfers_eth: ITransferTx[] = stats_eth.users[0].transfers;
        const approvals_eth: IApprovalTx[] = stats_eth.users[0].approvals;
        const totalGro = stats_eth.users[0].vestingBonus.vesting_gro
        const netReward = stats_eth.users[0].vestingBonus.net_reward;
        const latestStartTime = stats_eth.users[0].vestingBonus.latest_start_time
        const airdropClaims = stats_eth.users[0].airdrop_claims;
        const vestingAirdrop = stats_eth.users[0].vestingAirdrop;
        const onlyGtoken = (item: string) => ['gvt', 'pwrd'].includes(item) ? true : false;
        const groBalanceCombined = getGroBalanceCombined(
            parseFloat(totals_eth.amount_total_gro),
            parseFloat(totalGro),
            parseFloat(totals_eth.amount_total_gro_team),
            pools,
            stats_eth.poolDatas,
        );

        // Personal stats output
        const result: IPersonalStatsEthereum = {
            'status': md_eth.status as Status,
            'network_id': md_eth.network_id.toString() as NetworkId,
            'network': md_eth.network_name as NetworkName,
            'launch_timestamp': md_eth.launch_timestamp.toString(),
            'current_timestamp': currentTimestamp.toString(),
            'address': stats_eth.users[0].address as string,
            'prices': stats_eth.prices[0],
            'airdrops': getAirdrops(
                account,
                airdropClaims,
            ),
            'amount_added': {
                'pwrd': toStr(parseFloat(totals_eth.value_added_pwrd)),
                'gvt': toStr(parseFloat(totals_eth.value_added_gvt)),
                'total': toStr(totals_eth.value_added_total),
            },
            'amount_removed': {
                'pwrd': toStr(totals_eth.value_removed_pwrd),
                'gvt': toStr(totals_eth.value_removed_gvt),
                'total': toStr(totals_eth.value_removed_total),
            },
            'net_amount_added': {
                'pwrd': toStr(totals_eth.net_value_pwrd),
                'gvt': toStr(totals_eth.net_value_gvt),
                'total': toStr(totals_eth.net_value_total),
            },
            'current_balance': {
                'pwrd': toStr(currentBalancePwrd),
                'gvt': toStr(currentBalanceGvt),
                'total': toStr(currentBalanceTotal),
            },
            'net_returns': {
                'pwrd': toStr(netReturnsPwrd),
                'gvt': toStr(netReturnsGvt),
                'total': toStr(netReturnsTotal),
            },
            'transaction': {
                'deposits': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'core_deposit'
                        && onlyGtoken(item.token)
                    )),
                'withdrawals': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'core_withdrawal'
                        && onlyGtoken(item.token)
                    )),
                'transfers_in': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'transfer_in'
                        && onlyGtoken(item.token)
                    )),
                'transfers_out': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'transfer_out'
                        && onlyGtoken(item.token)
                    )),
                'approvals': approvals_eth
                    .filter((item: IApprovalTx) =>
                        onlyGtoken(item.token)
                    ),
                'staker_deposits': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'staker_deposit'
                    )),
                'staker_withdrawals': transfers_eth
                    .filter((item: ITransferTx) => (
                        item.type === 'staker_withdrawal'
                    )),
                'failures': [] as []
            },
            'vest_bonus': getVestingBonus(
                parseFloat(totalGro),
                parseFloat(netReward),
                parseInt(currentTimestamp),
                latestStartTime,
                md_eth.total_locked_amount,
                md_eth.total_bonus,
                md_eth.global_start_time,
                parseFloat(md_eth.init_unlocked_percent),
            ),
            'pools': {
                'all': allPools,
                'single_staking_100_gro_0': pools[0],
                'uniswap_v2_5050_gro_gvt_1': pools[1],
                'uniswap_v2_5050_gro_usdc_2': pools[2],
                'single_staking_100_gvt_3': pools[3],
                'curve_meta_pwrd_3crv_4': pools[4],
                'balancer_v2_8020_gro_weth_5': pools[5],
                'single_staking_100_pwrd_6': pools[6]
            },
            'gro_balance_combined': groBalanceCombined.total,
            'gro_balance_combined_detail': groBalanceCombined.detail,
            'vesting_airdrop': getVestingAirdrop(
                account,
                vestingAirdrop,
                parseInt(currentTimestamp),
            ),
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

import moment from 'moment';
import { showError } from '../handler/logHandler';
import { IPool } from '../interfaces/IPool';
import { ITransferTx } from '../interfaces/ITransferTx';
import { IApprovalTx } from '../interfaces/IApprovalTx';
import { IPersonalStatsEthereum } from '../interfaces/IPersonalStats';
import { IPoolData } from '../interfaces/IPoolData';
import {
    emptyEthUser,
    EMPTY_POOL_DATA, // TODO: to be renewed
    NO_POOL_DATA,
} from './personalStatsEmpty';
import {
    Status,
    NetworkId,
    NetworkName,
} from '../types';


export const parsePersonalStatsSubgraphEthereum = (
    account: string,
    stats_eth: any
): IPersonalStatsEthereum => {
    try {
        const currentTimestamp = stats_eth._meta.block.timestamp;
        if (stats_eth.users.length === 0)
            return emptyEthUser(
                currentTimestamp,
                account,
                Status.OK,
            );

        const md_eth = stats_eth.masterDatas[0];
        const totals_eth = stats_eth.users[0].totals;
        const transfers_eth: ITransferTx[] = stats_eth.users[0].transfers;
        const approvals_eth: IApprovalTx[] = stats_eth.users[0].approvals;
        const poolInfo: IPoolData[] = stats_eth.poolDatas;

        // Pre-calculations
        const currentBalancePwrd = parseFloat(totals_eth.net_based_amount_pwrd) / parseFloat(stats_eth.factors[0].pwrd);
        const currentBalanceGvt = parseFloat(totals_eth.net_amount_gvt) * parseFloat(stats_eth.prices[0].gvt);
        const currentBalanceTotal = currentBalancePwrd + currentBalanceGvt;
        const netReturnsPwrd = currentBalancePwrd - parseFloat(totals_eth.net_value_pwrd);
        const netReturnsGvt = currentBalanceGvt - parseFloat(totals_eth.net_value_gvt);
        const netReturnsTotal = netReturnsPwrd + netReturnsGvt;

        const onlyGtoken = (item: string) => ['gvt', 'pwrd'].includes(item) ? true : false;

        const result = {
            "status": md_eth.status as Status,
            "network_id": md_eth.networkId.toString() as NetworkId,
            "network": md_eth.networkName as NetworkName,
            "launch_timestamp": md_eth.launchTimestamp.toString(),
            "current_timestamp": currentTimestamp.toString(),
            "address": stats_eth.users[0].address as string,
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
                "pwrd": 'N/A',
                "gvt": 'N/A',
                "total": 'N/A'
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
                "locked_gro": 'N/A',
                "net_reward": 'N/A',
                "rewards": {
                    "claim_now": 'N/A',
                    "vest_all": 'N/A'
                }
            },
            "pools": {
                "all": getAllPools(stats_eth, poolInfo),
                "single_staking_100_gro_0": getPool(0, stats_eth, poolInfo),
                "uniswap_v2_5050_gro_gvt_1": getPool(1, stats_eth, poolInfo),
                "uniswap_v2_5050_gro_usdc_2": getPool(2, stats_eth, poolInfo),
                "single_staking_100_gvt_3": getPool(3, stats_eth, poolInfo),
                "curve_meta_pwrd_3crv_4": getPool(4, stats_eth, poolInfo),
                "balancer_v2_8020_gro_weth_5": getPool(5, stats_eth, poolInfo),
                "single_staking_100_pwrd_6": getPool(6, stats_eth, poolInfo)
            },
            "gro_balance_combined": 'N/A',
            "vesting_airdrop": {
                "name": 'N/A',
                "token": 'N/A',
                "amount": 'N/A',
                "claim_initialized": 'N/A',
                "claimed_amount": 'N/A',
                "claimable_amount": 'N/A',
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

// TODO: No cal passar _poolInfo, ja està inclòs en stats_eth
const getPool = (poolId: number, stats_eth: any, _poolInfo: IPoolData[]): IPool => {
    try {
        let pricePerShare = -1;
        const pool = stats_eth.users[0][`pool_${poolId}`];
        const price = stats_eth.prices[0];
        if (pool.length === 0) {
            return NO_POOL_DATA;
        } else {
            const balance = parseFloat(pool[0].balance);
            switch (poolId) {
                case 0:
                    pricePerShare = parseFloat(stats_eth.prices[0].gro);
                    break;
                case 1:
                    // const poolInfo = getPoolInfo(_poolInfo, poolId);
                    // const gvtAmount = (balance * poolInfo.totalSupply) * poolInfo.reserve0;
                    // const groAmount = (balance * poolInfo.totalSupply) * poolInfo.reserve1;
                    // pricePerShare = gvtAmount * price.gvt;
                    break;
                case 2:
                    break;
                case 3:
                    pricePerShare = parseFloat(stats_eth.prices[0].gvt);
                    break;
                case 4:
                    pricePerShare = parseFloat(stats_eth.prices[0].curve_pwrd3crv);
                    break;
                case 5:
                    break;
                case 6:
                    pricePerShare = 1;
                    break;
                default:
                    showError('parser/personalStatsEth.ts->getPool()', `Pool <${poolId} not found`);
                    break;
            }
            console.log('pool', poolId, 'pricePerShare:', pricePerShare, 'balance', (parseFloat(pool[0].balance)));
            return {
                'net_reward': pool[0].net_reward,
                'balance': (balance * pricePerShare).toString(),
                'coinBalance': pool[0].balance,
                'rewards': {
                    'claim_now': 'N/A',
                    'vest_all': 'N/A'
                }
            }
        }
    } catch (err) {
        showError('parser/personalStatsEth.ts->getPool()', err);
        return NO_POOL_DATA;
    }
}

const getAllPools = (stats_eth: any, _poolInfo: IPoolData[]): IPool => {
    let net_reward = 0;
    let balance = 0;
    for (let i = 0; i <= 6; i += 1) {
        const pool = getPool(i, stats_eth, _poolInfo);
        net_reward += parseFloat(pool.net_reward);
        balance += parseFloat(pool.balance);
    }
    return {
        'net_reward': net_reward.toString(),
        'balance': balance.toString(),
        'coinBalance': '--',
        'rewards': {
            'claim_now': 'N/A',
            'vest_all': 'N/A'
        }
    }
}

// TODO: to be renamed
// TODO: handle exception if not found
const getPoolInfo = (
    _poolMD: IPoolData[],
    _poolId: number
): IPoolData => {
    const result = _poolMD[_poolId];
    return _poolMD[_poolId];
}

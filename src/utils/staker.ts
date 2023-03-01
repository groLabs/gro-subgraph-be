import { Env } from '../types';
import { toStr } from './utils';
import { NA } from '../constants';
import { showError } from '../handler/logHandler';
import { IPool } from '../interfaces/personalStats/IPool';
import { IPoolData } from '../interfaces/personalStats/IPoolData';
import { IStakerData } from '../interfaces/personalStats/IStakerData';
import { IGroBalanceCombined } from '../interfaces/personalStats/IGroBalanceCombined';
import {
    NO_POOL,
    EMPTY_POOL,
} from '../parser/personalStatsEmpty';


export const getPool = (
    poolId: number,
    stats_eth: any
): IPool => {
    try {
        let pricePerShare = -1;
        const pool = stats_eth.users[0][`pool_${poolId}`];
        const price = stats_eth.prices[0];
        if (pool.length === 0) {
            return EMPTY_POOL;
        } else {
            const balance = parseFloat(pool[0].balance);
            switch (poolId) {
                case 0:
                    pricePerShare = parseFloat(price.gro);
                    break;
                case 1:
                    pricePerShare = parseFloat(price.uniswap_gvt_gro);
                    break;
                case 2:
                    pricePerShare = parseFloat(price.uniswap_gro_usdc);
                    break;
                case 3:
                    pricePerShare = parseFloat(price.gvt);
                    break;
                case 4:
                    pricePerShare = parseFloat(price.curve_pwrd3crv);
                    break;
                case 5:
                    pricePerShare = parseFloat(price.balancer_gro_weth);
                    break;
                case 6:
                    pricePerShare = 1;
                    break;
                default:
                    showError('parser/personalStatsEth.ts->getPool()', `Pool <${poolId} not found`);
                    break;
            }
            // console.log('pool', poolId, 'pricePerShare:', pricePerShare, 'balance', (parseFloat(pool[0].balance)));
            const reward = calcRewards(
                poolId,
                pool[0].balance,
                pool[0].reward_debt,
                stats_eth
            );
            return {
                'net_reward': pool[0].net_reward,
                'balance': toStr(balance * pricePerShare),
                'coinBalance': pool[0].balance,
                'rewards': {
                    'claim_now': toStr(reward * 0.3),
                    'vest_all': toStr(reward)
                }
            }
        }
    } catch (err) {
        showError('parser/personalStatsEth.ts->getPool()', err);
        return NO_POOL;
    }
}

export const getAllPools = (pools: IPool[]): IPool => {
    let net_reward = 0;
    let balance = 0;
    let claim_now = 0;
    let vest_all = 0;
    for (let i = 0; i <= 6; i += 1) {
        const pool = pools[i];
        net_reward += pool.net_reward === NA
            ? 0
            : parseFloat(pool.net_reward);
        balance += pool.balance === NA
            ? 0
            : parseFloat(pool.balance);
        claim_now += pool.rewards.claim_now === NA
            ? 0
            : parseFloat(pool.rewards.claim_now);
        vest_all += pool.rewards.vest_all === NA
            ? 0
            : parseFloat(pool.rewards.vest_all);
    }
    return {
        'net_reward': toStr(net_reward),
        'balance': toStr(balance),
        'coinBalance': '--',
        'rewards': {
            'claim_now': toStr(claim_now),
            'vest_all': toStr(vest_all),
        }
    }
}

export const calcRewards = (
    poolId: number,
    _balance: string,
    _rewardDebt: string,
    stats_eth: any
): number => {
    const staker = stats_eth.stakerDatas.filter(
        (item: IStakerData) => item.id == poolId.toString()
    );
    const balance = parseFloat(_balance);
    if (staker) {
        const rewardDebt = parseFloat(_rewardDebt);
        const groPerBlock = parseFloat(stats_eth.masterDatas[0].gro_per_block);
        const currentBlock = stats_eth._meta.block.number;
        const blockNumber = staker[0].block_number;
        const poolShare = parseFloat(staker[0].pool_share);
        const accGroPerShare = parseFloat(staker[0].acc_gro_per_share);
        const lpSupply = parseFloat(staker[0].lp_supply);
        const reward =
            balance * (
                accGroPerShare
                + ((currentBlock - blockNumber) * groPerBlock * poolShare) / lpSupply
            ) - rewardDebt;
        return reward;
    } else {
        return 0;
    }
}

export const getGroBalanceCombined = (
    pool0GroAmount: number,
    vestingAmount: number,
    teamAmount: number,
    pools: IPool[],
    poolDatas: IPoolData[],
): IGroBalanceCombined => {
    // Gro-related pools (not single-sided): 1,2 & 5
    const pool1LPAmount = parseFloat(pools[1].coinBalance);
    const pool2LPAmount = parseFloat(pools[2].coinBalance);
    const pool5LPAmount = parseFloat(pools[5].coinBalance);
    const pool1Data = poolDatas.filter((item: IPoolData) => item.id == '1')[0];
    const pool2Data = poolDatas.filter((item: IPoolData) => item.id == '2')[0];
    const pool5Data = poolDatas.filter((item: IPoolData) => item.id == '5')[0];
    const pool1TotalSupply = (pool1Data) ? parseFloat(pool1Data.total_supply) : 0;
    const pool2TotalSupply = (pool2Data) ? parseFloat(pool2Data.total_supply) : 0;
    const pool5TotalSupply = (pool5Data) ? parseFloat(pool5Data.total_supply) : 0;
    const pool1GroReserve = (pool1Data) ? parseFloat(pool1Data.reserve1) : 0;
    const pool2GroReserve = (pool2Data) ? parseFloat(pool2Data.reserve0) : 0;
    const pool5GroReserve = (pool5Data) ? parseFloat(pool5Data.reserve0) : 0;
    const pool1GroAmount = (pool1TotalSupply !== 0)
        ? (pool1LPAmount * pool1GroReserve) / pool1TotalSupply
        : 0;
    const pool2GroAmount = (pool2TotalSupply !== 0)
        ? (pool2LPAmount * pool2GroReserve) / pool2TotalSupply
        : 0;
    const pool5GroAmount = (pool5TotalSupply != 0)
        ? (pool5LPAmount * pool5GroReserve) / pool5TotalSupply
        : 0;
    return {
        'total': toStr(
            pool0GroAmount
            + pool1GroAmount
            + pool2GroAmount
            + pool5GroAmount
            + vestingAmount
        ),
        'detail': {
            'unstaked/pool0': toStr(pool0GroAmount),
            'pool1': toStr(pool1GroAmount),
            'pool2': toStr(pool2GroAmount),
            'pool5': toStr(pool5GroAmount),
            'vesting': toStr(vestingAmount),
            'team': toStr(teamAmount),
        }
    }
}

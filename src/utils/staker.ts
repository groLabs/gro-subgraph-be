import { IPool } from '../interfaces/IPool';
import { IPoolData } from '../interfaces/IPoolData';
import { IStakerData } from '../interfaces/IStakerData';
import { IGroBalanceCombined } from '../interfaces/IGroBalanceCombined';
import { showError } from '../handler/logHandler';
import {
    NO_POOL,
    EMPTY_POOL,
} from '../parser/personalStatsEmpty';
import { NA } from '../constants';
import { Env } from '../types';


export const getPool = (poolId: number, stats_eth: any): IPool => {
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
                'balance': (balance * pricePerShare).toString(),
                'coinBalance': pool[0].balance,
                'rewards': {
                    'claim_now': (reward * 0.3).toString(),
                    'vest_all': reward.toString()
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
        'net_reward': net_reward.toString(),
        'balance': balance.toString(),
        'coinBalance': '--',
        'rewards': {
            'claim_now': claim_now.toString(),
            'vest_all': vest_all.toString(),
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
        const accGroPerShare = parseFloat(staker[0].acc_gro_per_share); //TODO: fix it in subgraph
        const lpSupply = parseFloat(staker[0].lp_supply);
        const reward = balance * (accGroPerShare + ((currentBlock - blockNumber) * groPerBlock * poolShare) / lpSupply) - rewardDebt;
        if (process.env.NODE_ENV === Env.DEV) {
            showCalcRewards(
                poolId,
                balance,
                groPerBlock,
                currentBlock,
                blockNumber,
                poolShare,
                accGroPerShare,
                rewardDebt,
                lpSupply,
                reward,
            );
        }
        return reward;
    } else {
        return 0;
    }
}

const showCalcRewards = (
    poolId: number,
    balance: number,
    groPerBlock: number,
    currentBlock: number,
    blockNumber: number,
    poolShare: number,
    accGroPerShare: number,
    rewardDebt: number,
    lpSupply: number,
    reward: number,
): void => {
    console.log(`Reward calculation for PoolId ${poolId}`);
    console.log(`balance: ${balance} groPerBlock: ${groPerBlock} currentBlock: ${currentBlock}`);
    console.log(`blockNumber: ${blockNumber} poolShare: ${poolShare} accGroPerShare: ${accGroPerShare}`);
    console.log(`rewardDebt: ${rewardDebt} lpSupply: ${lpSupply} => reward: ${reward}`);
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
    const pool1Data = poolDatas.filter((item: IPoolData) => item.poolId == 1)[0];
    const pool2Data = poolDatas.filter((item: IPoolData) => item.poolId == 2)[0];
    const pool5Data = poolDatas.filter((item: IPoolData) => item.poolId == 5)[0];
    const pool1TotalSupply = parseFloat(pool1Data.total_supply);
    const pool2TotalSupply = parseFloat(pool2Data.total_supply);
    const pool5TotalSupply = parseFloat(pool5Data.total_supply);
    const pool1GroReserve = parseFloat(pool1Data.reserve1);
    const pool2GroReserve = parseFloat(pool1Data.reserve0);
    const pool5GroReserve = parseFloat(pool1Data.reserve0);

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
        'total': (
            pool0GroAmount
            + pool1GroAmount
            + pool2GroAmount
            + pool5GroAmount
            + vestingAmount
            + teamAmount
        ).toFixed(7).toString(),
        'detail': {
            'unstaked/pool0': pool0GroAmount.toString(),
            'pool1': pool1GroAmount.toString(),
            'pool2': pool2GroAmount.toString(),
            'pool5': pool5GroAmount.toString(),
            'vesting': vestingAmount.toString(),
            'team': teamAmount.toString(),
        }
    }
}


/*
_user_lp
* (  _acc_gro_per_share
   +   (  (_current_block - _block_number)
        * _gro_per_block
        * _pool_share)
     / (_lp_supply))
- _user_debt AS _claimable


lp_supply: 43340.95345332 (pool5_pool.balanceOf(staker) or staker_event.LogUpdatePool)
acc_gro_per_share: 1.933852981389  (poolInfo.accGroPerShare or staker_event.LogUpdatePool)
alloc_point: 4  (poolInfo.allocPoint or staker_event.LogSetPool)
totalAlloc: 609 (staker.totalAllocPoint or ev.LogSetPool+ev.LogUpdatePool)
gro_per_block: 0.40000000 (staker_event.LogGroPerBlock)
pool_share: 0.00656814449917898194
user_lp: 72.289497719059   (coinBalance)
user_claimed: 110.317701782206   (netReward)
user_debt: 125.153062090580  (rewardDebt)
block_timestamp: 1665366731
block_number: 15714536"
*/
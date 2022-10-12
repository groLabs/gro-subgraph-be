import { IPool } from '../interfaces/IPool';
import { showError } from '../handler/logHandler';
import { IStakerData } from '../interfaces/IStakerData';
import {
    NO_POOL,
    EMPTY_POOL,
} from '../parser/personalStatsEmpty';
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
        net_reward += pool.net_reward === 'N/A'
            ? 0
            : parseFloat(pool.net_reward);
        balance += pool.balance === 'N/A'
            ? 0
            : parseFloat(pool.balance);
        claim_now += pool.rewards.claim_now === 'N/A'
            ? 0
            : parseFloat(pool.rewards.claim_now);
        vest_all += pool.rewards.vest_all === 'N/A'
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
) : number => {
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
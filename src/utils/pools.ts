import { toStr } from './utils';
import { pools } from '../data/pools';
import { IPool } from '../interfaces/groStats/ethereum/IPool';
import { ITokenPriceUsd } from '../interfaces/groStats/ethereum/ITokenPriceUsd';
import {
    TS_1D,
    BLOCKS_PER_YEAR,
} from '../constants';


/// @notice Gets the price of a token based on the provided pool ID
/// @param pool - The pool ID to find the token price
/// @param price - An object containing various token prices
/// @return The price of the token corresponding to the provided pool ID
const getPrice = (
    pool: number,
    price: ITokenPriceUsd,
): number => {
    switch (pool) {
        case 0:
            return parseFloat(price.gro);
        case 1:
            return parseFloat(price.uniswap_gvt_gro);
        case 2:
            return parseFloat(price.uniswap_gro_usdc);
        case 3:
            return parseFloat(price.gvt);
        case 4:
            return parseFloat(price.curve_pwrd3crv);
        case 5:
            return parseFloat(price.balancer_gro_weth);
        case 6:
            return parseFloat(price.pwrd);
        default:
            return 0;
    }
}

/// @notice Calculates the annual percentage yield (APY) of pool fees for a given pool
/// @param poolId - The ID of the pool
/// @param swaps - An array containing swap data
/// @param poolData - An array containing pool data
/// @param nowTS - The current timestamp
/// @return The calculated APY of pool fees for the given pool ID
const getApyPoolFees = (
    poolId: number,
    swaps: any[],
    poolData: any,
    nowTS: number,
): number => {
    if (poolId === 0) {
        return 0;
    } else if (poolId === 1) {
        if (poolData.length > 0) {
            const reserve1 = parseFloat(poolData[0].reserve1);
            const _swaps = swaps.reduce(
                (prev, current) =>
                    ((parseInt(current.poolId) === 1) && (parseInt(current.block_timestamp) >= nowTS - TS_1D))
                        ? prev + parseFloat(current.amount1_in) + parseFloat(current.amount1_out)
                        : prev + 0
                , 0);
            const apy_1d_pool1 = (reserve1 > 0) ? (_swaps * 3 / 1000) / (reserve1 * 2) : 0;
            return apy_1d_pool1 * 365;
        } else {
            return 0;
        }
    } else if (poolId === 2) {
        if (poolData.length > 0) {
            const reserve0 = parseFloat(poolData[0].reserve0);
            const _swaps = swaps.reduce(
                (prev, current) =>
                    ((parseInt(current.poolId) === 2) && (parseInt(current.block_timestamp) >= nowTS - TS_1D))
                        ? prev + parseFloat(current.amount0_in) + parseFloat(current.amount0_out)
                        : prev + 0
                , 0);
            const apy_1d_pool2 = (reserve0 > 0) ? (_swaps * 3 / 1000) / (reserve0 * 2) : 0;
            return apy_1d_pool2 * 365;
        } else {
            return 0;
        }
    } else if (poolId === 3) {
        return 0;
    } else if (poolId === 4) {
        const _swaps = swaps.filter(item => item.poolId === 4);
        if (_swaps.length > 0) {
            let maxSwap = _swaps.reduce((prev, curr) =>
                (prev.block_timestamp > curr.block_timestamp)
                    ? prev
                    : curr);
            let minSwap = _swaps.reduce((prev, curr) =>
                (prev.block_timestamp < curr.block_timestamp)
                    ? prev
                    : curr);
            let apy_1d_pool4 = maxSwap.virtual_price - minSwap.virtual_price;
            return apy_1d_pool4 * 365;
        } else {
            return 0;
        }
    } else if (poolId === 5) {
        const rates = swaps.filter(item => item.poolId === 5);
        if (rates.length > 0) {
            let maxSwap = rates.reduce((prev, curr) =>
                (prev.virtual_price > curr.virtual_price)
                    ? prev
                    : curr);
            let minSwap = rates.reduce((prev, curr) =>
                (prev.virtual_price < curr.virtual_price)
                    ? prev
                    : curr);
            let apy_1d_pool5 = maxSwap.virtual_price - minSwap.virtual_price;
            return apy_1d_pool5 * 365;
        } else {
            return 0;
        }
    } else if (poolId === 6) {
        return 0;
    } else {
        return 0;
    }
}

/// @notice Calculates the APY of a token for a given pool ID
/// @param poolId - The ID of the pool
/// @param pwrdApy - The APY of the PWRD token
/// @param gvtApy - The APY of the GVT token
/// @return The calculated APY of the token for the given pool ID
const getApyToken = (
    poolId: number,
    pwrdApy: number,
    gvtApy: number,
): number => {
    switch (poolId) {
        case 1: // gvt-gro
            return gvtApy * 0.5;
        case 3: // gvt
            return gvtApy;
        case 4: // curve metapool
            return pwrdApy * 0.5;
        case 6: // ss-pwrd
            return pwrdApy;
        default: // others
            return 0;
    }
}

/// @notice Calculates the APY of rewards for a given pool
/// @param groUsdPrice - The price of GRO in USD
/// @param groPerBlock - The amount of GRO rewards per block
/// @param poolAllocPoint - The allocation points for the pool
/// @param totalAllocPoint - The total allocation points
/// @param stakedTvl - The total value locked (TVL) in the pool
/// @return The calculated APY of rewards for the given pool
const getApyRewards = (
    groUsdPrice: number,
    groPerBlock: number,
    poolAllocPoint: number,
    totalAllocPoint: number,
    stakedTvl: number,
): number => {
    if (stakedTvl > 0 && totalAllocPoint > 0) {
        const allocShare = poolAllocPoint / totalAllocPoint;
        return (groPerBlock * groUsdPrice * BLOCKS_PER_YEAR * allocShare) / stakedTvl;
    } else {
        return 0;
    }
}

/// @notice Calculates the amount of unstaked tokens in a pool
/// @param poolId - The ID of the pool
/// @param coreData - An object containing core data of the protocol
/// @param stakedSupply - The amount of staked tokens in the pool
/// @return The amount of unstaked tokens in the pool, in string format
const getUnstaked = (
    poolId: number,
    coreData: any,
    stakedSupply: number,
): string => {
    let totalSupply = '0';
    switch (poolId) {
        case 0:
            totalSupply = coreData.total_supply_gro;
            break;
        case 1:
            totalSupply = coreData.total_supply_uniswap_gvt_gro;
            break;
        case 2:
            totalSupply = coreData.total_supply_uniswap_gro_usdc;
            break;
        case 3:
            totalSupply = coreData.total_supply_gvt;
            break;
        case 4:
            totalSupply = coreData.total_supply_curve_pwrd3crv;
            break;
        case 5:
            totalSupply = coreData.total_supply_balancer_gro_weth;
            break;
        case 6:
            totalSupply = coreData.total_supply_pwrd_based;
            break;
    }
    const result = toStr((parseFloat(totalSupply) - stakedSupply) * 1e18);
    return result;
}

/// @notice Calculates the total value locked (TVL) in a pool
/// @param poolId - The ID of the pool
/// @param coreData - An object containing core data of the protocol
/// @param price - An object containing various token prices
/// @param staked - The amount of staked tokens in the pool
/// @return The TVL of the pool, in string format
const getTvl = (
    poolId: number,
    coreData: any,
    price: ITokenPriceUsd,
    staked: number,
): string => {
    let totalSupply = 0;
    switch (poolId) {
        case 0:
            totalSupply = staked;
            break;
        case 1:
            totalSupply = parseFloat(coreData.total_supply_uniswap_gvt_gro);
            break;
        case 2:
            totalSupply = parseFloat(coreData.total_supply_uniswap_gro_usdc);
            break;
        case 3:
            totalSupply = staked;
            break;
        case 4:
            totalSupply = parseFloat(coreData.total_supply_curve_pwrd3crv);
            break;
        case 5:
            totalSupply = parseFloat(coreData.total_supply_balancer_gro_weth);
            break;
        case 6:
            totalSupply = staked;
            break;
    }
    return toStr(totalSupply * getPrice(poolId, price));
}

/// @notice Generates an array of pool objects with updated data
/// @param poolData - An array containing pool data
/// @param stakerData - An array containing staker data
/// @param masterData - An object containing data from the master contract
/// @param coreData - An object containing core data of the protocol
/// @param prices - An object containing various token prices
/// @param swaps - An array containing swap data
/// @param nowTS - The current timestamp
/// @param pwrdApy - The APY of the PWRD token
/// @param gvtApy - The APY of the GVT token
/// @return An array of updated pool objects
export const getPools = (
    poolData: any[],
    stakerData: any[],
    masterData: any,
    coreData: any,
    prices: ITokenPriceUsd,
    swaps: any[],
    nowTS: number,
    pwrdApy: number,
    gvtApy: number,
): IPool[] => {
    let result: IPool[] = [];
    for (let i = 0; i < stakerData.length; i++) {
        let pool = pools[i];
        const price = getPrice(i, prices);
        const staked = parseFloat(stakerData[i].lp_supply);
        pool.lp_usd_price = toStr(price);
        pool.staked = toStr(parseFloat(stakerData[i].lp_supply) * 1e18);
        pool.unstaked = getUnstaked(
            i,
            coreData,
            staked,
        );
        pool.tvl_staked = toStr(staked * price);
        pool.tvl = getTvl(
            i,
            coreData,
            prices,
            staked,
        );
        const _poolData = poolData.filter(item => item.id === i.toString());
        const apyFee = getApyPoolFees(
            i,
            swaps,
            _poolData,
            nowTS,
        );
        const apyToken = getApyToken(
            i,
            pwrdApy,
            gvtApy,
        );
        const apyReward = getApyRewards(
            parseFloat(prices.gro),
            parseFloat(masterData.gro_per_block),
            parseInt(stakerData[i].alloc_point),
            parseInt(masterData.total_alloc),
            parseFloat(pool.tvl_staked),
        );
        pool.apy.current = {
            'total': toStr(apyFee + apyToken + apyReward),
            'token': toStr(apyToken),
            'pool_fees': toStr(apyFee),
            'reward': toStr(apyReward),
        }
        result.push(pools[i]);
    }
    return result;
}

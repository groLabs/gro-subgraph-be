import { toStr } from './utils';
import { pools } from '../data/pools';
import { IPool } from '../interfaces/groStats/ethereum/IPool';
import { ITokenPriceUsd } from '../interfaces/groStats/ethereum/ITokenPriceUsd';
import {
    TS_1D,
    BLOCKS_PER_YEAR,
} from '../constants';


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
            "total": toStr(apyFee + apyToken + apyReward),
            "token": toStr(apyToken),
            "pool_fees": toStr(apyFee),
            "reward": toStr(apyReward),
        }
        result.push(pools[i]);
    }
    return result;
}

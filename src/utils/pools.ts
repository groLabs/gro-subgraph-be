import {
    toStr,
    bnToDecimal,
} from './utils';
import {
    NA,
    DECIMALS,
} from '../constants';
import { Token } from '../types';
import { BigNumber as BN } from "bignumber.js";
import { IPool } from '../interfaces/groStats/ethereum/IPool';
import { ITokenPriceUsd } from '../interfaces/groStats/ethereum/ITokenPriceUsd';


const ZERO = toStr(0);
const poolData = [
    {
        "deposit_url": NA,
        "remove_url": NA,
        "name": 'single_staking_100_gro_0',
        "display_name": 'GRO',
        "type": 'ss_1',
        "display_type": 'Gro Pool',
        "display_order": '1',
        "tokens": [
            Token.GRO
        ],
        "pid": '0',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '1',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": 'https://app.uniswap.org/#/add/v2/0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7/0x3ADb04E127b9C0a5D36094125669d4603AC52a0c',
        "remove_url": 'https://app.uniswap.org/#/remove/v2/0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7/0x3ADb04E127b9C0a5D36094125669d4603AC52a0c',
        "name": 'uniswap_v2_5050_gro_gvt_1',
        "display_name": 'GRO / Vault',
        "type": 'uniswap_v2',
        "display_type": 'Uniswap v2',
        "display_order": '2',
        "tokens": [
            Token.GRO,
            Token.GVT
        ],
        "pid": '1',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '2',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": 'https://app.uniswap.org/#/add/v2/0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        "remove_url": 'https://app.uniswap.org/#/remove/v2/0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        "name": 'uniswap_v2_5050_gro_usdc_2',
        "display_name": 'GRO / USDC',
        "type": 'uniswap_v2',
        "display_type": 'Uniswap v2',
        "display_order": '3',
        "tokens": [
            Token.GRO,
            Token.USDC
        ],
        "pid": '2',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '2',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": NA,
        "remove_url": NA,
        "name": 'single_staking_100_gvt_3',
        "display_name": 'Vault',
        "type": 'ss_1',
        "display_type": 'Vault Pool',
        "display_order": '4',
        "tokens": [
            Token.GVT,
        ],
        "pid": '3',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '1',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": 'https://curve.fi/factory/44/deposit',
        "remove_url": 'https://curve.fi/factory/44/withdraw',
        "name": 'curve_meta_pwrd_3crv_4',
        "display_name": 'PWRD-3CRV',
        "type": 'curve_meta',
        "display_type": 'Curve Meta',
        "display_order": '5',
        "tokens": [
            Token.PWRD,
            Token.DAI,
            Token.USDC,
            Token.USDT,
        ],
        "pid": '4',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '4',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": 'https://app.balancer.fi/#/pool/0x702605f43471183158938c1a3e5f5a359d7b31ba00020000000000000000009f',
        "remove_url": NA,
        "name": 'balancer_v2_8020_gro_weth_5',
        "display_name": 'GRO 80% / WETH 20%',
        "type": 'balancer_v2',
        "display_type": 'Balancer v2',
        "display_order": '0',
        "tokens": [
            Token.GRO,
            Token.WETH,
        ],
        "pid": '5',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '2',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
    {
        "deposit_url": NA,
        "remove_url": NA,
        "name": 'single_staking_100_pwrd_6',
        "display_name": 'PWRD',
        "type": 'ss_1',
        "display_type": 'PWRD Pool',
        "display_order": '6',
        "tokens": [
            Token.PWRD,
        ],
        "pid": '6',
        "tvl": ZERO,
        "tvl_staked": ZERO,
        "staked": ZERO,
        "unstaked": ZERO,
        "required_tokens_num": '1',
        "disable": 'false',
        "lp_usd_price": ZERO,
        "apy": {
            "current": {
                "total": ZERO,
                "token": ZERO,
                "pool_fees": ZERO,
                "reward": ZERO
            }
        }
    },
]

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

const getTvl = (
    pool: number,
): number => {
    switch (pool) {
        case 0:
            return parseFloat('0');
        case 1:
            return parseFloat('0');
        case 2:
            return parseFloat('0');
        case 3:
            return parseFloat('0');
        case 4:
            return parseFloat('0');
        case 5:
            return parseFloat('0');
        case 6:
            return parseFloat('0');
        default:
            return 0;
    }
}

const getApyPoolFees = (
    poolId: number,
    swaps: any[],
    poolData: any,
    nowTS: number,
): string => {
    if (poolId === 0) {
        return toStr(0);
    } else if (poolId === 1) {
        if (poolData.length > 0) {
            const reserve1 = parseFloat(poolData[0].reserve1);
            const _swaps = swaps.reduce(
                (prev, current) =>
                    ((parseInt(current.poolId) === 1) && (parseInt(current.block_timestamp) >= nowTS - 86400))
                        ? prev + parseFloat(current.amount1_in) + parseFloat(current.amount1_out)
                        : prev + 0
                , 0);
            const apy_1d_pool1 = (reserve1 > 0) ? (_swaps * 3 / 1000) / (reserve1 * 2) : 0;
            return toStr(apy_1d_pool1 * 365);
        } else {
            return toStr(0);
        }
    } else if (poolId === 2) {
        if (poolData.length > 0) {
            const reserve0 = parseFloat(poolData[0].reserve0);
            const _swaps = swaps.reduce(
                (prev, current) =>
                    ((parseInt(current.poolId) === 2) && (parseInt(current.block_timestamp) >= nowTS - 86400))
                        ? prev + parseFloat(current.amount0_in) + parseFloat(current.amount0_out)
                        : prev + 0
                , 0);
            const apy_1d_pool2 = (reserve0 > 0) ? (_swaps * 3 / 1000) / (reserve0 * 2) : 0;
            return toStr(apy_1d_pool2 * 365);
        } else {
            return toStr(0);
        }
    } else if (poolId === 3) {
        return toStr(0);
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
            return toStr(apy_1d_pool4 * 365);
        } else {
            return toStr(0);
        }
    } else if (poolId === 5) {
        const _swaps = swaps.filter(item => item.poolId === 5);
        if (_swaps.length > 0) {
            let maxSwap = _swaps.reduce((prev, curr) =>
                (prev.block_timestamp > curr.block_timestamp)
                    ? prev
                    : curr);
            let minSwap = _swaps.reduce((prev, curr) =>
                (prev.block_timestamp < curr.block_timestamp)
                    ? prev
                    : curr);
            let apy_1d_pool5 = maxSwap.virtual_price - minSwap.virtual_price;
            return toStr(apy_1d_pool5 * 365);
        } else {
            return toStr(0);
        }
    } else if (poolId === 6) {
        return toStr(0);
    } else {
        return toStr(0);
    }
}

const getApyToken = (
    poolId: number,
    pwrdApy: number,
    gvtApy: number,
): number => {
    switch (poolId) {
        // gvt-gro
        case 1:
            return gvtApy * 0.5;
        // gvt
        case 3:
            return gvtApy;
        // curve metapool
        case 4:
            return pwrdApy * 0.5;
        // ss-pwrd
        case 6:
            return pwrdApy;
        // others
        default:
            return 0;
    }
}

export const getPools = (
    poolData: any[],
    stakerData: any[],
    prices: ITokenPriceUsd,
    swaps: any[],
    nowTS: number,
    pwrdApy: number,
    gvtApy: number,
) => {
    let result: IPool[] = [];
    for (let i = 0; i < stakerData.length; i++) {
        let pool = stakerData[i];
        const price = getPrice(i, prices);
        const staked = bnToDecimal(
            stakerData[i].lp_supply,
            18,
            DECIMALS
        );
        const stakedBN = new BN(stakerData[i].lp_supply);
        pool.lp_usd_price = toStr(price);
        pool.staked = stakerData[i].lp_supply;
        pool.unstaked = 'used?';
        pool.tvl_staked = toStr(staked * price);
        pool.tvl = 'used?';
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
        pool.apy = {
            "current": {
                "total": "0.0101",
                "token": toStr(apyToken),
                "pool_fees": apyFee,
                "reward": "0.0101"
            }
        }
        result.push(pool);
    }
    return result;
}

// const getUnstakedAmount = (
//     pool: number,
//     pwrdSupply: number,
//     gvtSupply: number,
// ): BN => {
//     switch (pool) {
//         case 0:
//             return new BN(1);
//         case 1:
//             return new BN(1);
//         case 2:
//             return new BN(1);
//         case 3:
//             return new BN(gvtSupply);
//         case 4:
//             return new BN(1);
//         case 5:
//             return new BN(1);
//         case 6:
//             return new BN(pwrdSupply);
//         default:
//             return new BN(0);
//     }
// }
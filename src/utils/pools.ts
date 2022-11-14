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

export const getPools = (
    pools: any[],
    prices: ITokenPriceUsd,
) => {
    let result: IPool[] = [];
    for (let i = 0; i < poolData.length; i++) {
        let pool = poolData[i];
        const price = getPrice(i, prices);
        const staked = bnToDecimal(
            pools[i].lp_supply,
            18,
            DECIMALS
        );
        const stakedBN = new BN(pools[i].lp_supply);
        pool.lp_usd_price = toStr(price);
        pool.staked = pools[i].lp_supply;
        pool.unstaked = 'used?';
        pool.tvl_staked = toStr(staked * price);
        pool.tvl = 'used?'
        result.push(poolData[i]);
    }
    return result;
}

const getFees = (
    pool: number,
): number => {
    switch (pool) {
        case 0:
            return 0;
        case 1:
            // do something
            return 0;
        case 2:
            // do something
            return 0;
        case 3:
            return 0;
        case 4:
            // do something
            return 0;
        case 5:
            // do something
            return 0;
        case 6:
            return 0;
        default:
            return 0;
    }
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

import { NA } from '../constants';
import { Token } from '../types';
import { toStr } from '../utils/utils';

const ZERO = toStr(0);

export const pools = [
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
];

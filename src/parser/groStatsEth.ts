import { toStr } from '../utils/utils';
import { getVaults } from '../utils/strategies';
import { IGroStatsEthereum } from '../interfaces/groStats/IGroStats';
import {
    Status,
    NetworkName,
} from '../types';
import {
    NA,
    LAUNCH_TIMESTAMP_ETH,
} from '../constants';


export const groStatsParserEthereum = (
    stats_eth: any
): IGroStatsEthereum => {
    let value = '0';
    const md = stats_eth.masterDatas[0];
    const price = stats_eth.prices[0];
    const core = stats_eth.coreDatas[0];
    const factor = stats_eth.factors[0];
    const strategies = stats_eth.strategies;
    const currentTimestamp = stats_eth._meta.block.timestamp;
    // calcs
    const pwrdTvl = parseFloat(core.total_supply_pwrd_based) / parseFloat(factor.pwrd);
    const gvtTvl = parseFloat(core.total_supply_gvt) * parseFloat(price.gvt);
    const totalTvl = pwrdTvl + gvtTvl;

    const result = {
        'status': md.status as Status,
        'current_timestamp': currentTimestamp.toString(),
        'launch_timestamp': LAUNCH_TIMESTAMP_ETH,
        'network': NetworkName.MAINNET,
        'apy': {
            'last24h': {
                'pwrd': value,
                'gvt': value,
            },
            'last7d': {
                'pwrd': value,
                'gvt': value,
            },
            'daily': {
                'pwrd': value,
                'gvt': value,
            },
            'weekly': {
                'pwrd': value,
                'gvt': value,
            },
            'monthly': {
                'pwrd': value,
                'gvt': value,
            },
            'all_time': {
                'pwrd': value,
                'gvt': value,
            },
            'current': {
                'pwrd': value,
                'gvt': value,
            },
            'hodl_bonus': value,
        },
        'tvl': {
            "pwrd": toStr(pwrdTvl),
            "gvt": toStr(gvtTvl),
            "total": toStr(totalTvl),
            "util_ratio": value,
            "util_ratio_limit_PD": value,
            "util_ratio_limit_GW": value,
        },
        'system': {
            'total_share': value,
            'total_amount': value,
            'last3d_apy': value,
            'lifeguard': {
                "stablecoins": [
                    {
                        "name": "DAI",
                        "display_name": "DAI",
                        "amount": value,
                    },
                    {
                        "name": "USDC",
                        "display_name": "USDC",
                        "amount": value,
                    },
                    {
                        "name": "USDT",
                        "display_name": "USDT",
                        "amount": value,
                    }
                ],
                "name": NA,
                "display_name": NA,
                "amount": value,
                "share": value,
                "last3d_apy": value,
            },
            'vault': getVaults(strategies),
        },
        'exposure': {
            'stablecoins': [],
            'protocols': [],
        },
        'token_price_usd': {
            "pwrd": toStr(price.pwrd),
            "gvt": toStr(price.gvt),
            "gro": toStr(price.gro),
        },
        'pools': [],
        'pwrdBoost': {
            "upperBoostApy": value,
            "lowerBoostApy": value,
        },
        'gvtBoost': {
            "upperBoostApy": value,
            "lowerBoostApy": value,
        },
    }
    return result;
}
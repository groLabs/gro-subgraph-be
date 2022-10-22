import {
    Status,
    NetworkName,
} from '../types';
import {
    NA,
    LAUNCH_TIMESTAMP_ETH,
    LAUNCH_TIMESTAMP_AVAX,
} from '../constants';
import { toStr } from '../utils/utils';
import {
    IGroStats,
    IGroStatsEthereum,
    IGroStatsAvalanche,
} from '../interfaces/groStats/IGroStats';


export const emptyGroStats = (
    currentTimestamp: string,
    status: Status
): IGroStats => {
    const value = (status === Status.OK) ? toStr(0) : NA;
    return {
        'status': Status.ERROR,
        "current_timestamp": currentTimestamp,
        "network": NetworkName.MAINNET,
        "mc_totals": {
            "tvl": {
                "mainnet": value,
                "avalanche": value,
                "total": value,
            }
        },
        'mainnet': emptyGroStatsEth(currentTimestamp, status),
        'avalanche': emptyGroStatsAvax(status),
    }
}

export const emptyGroStatsEth = (
    currentTimestamp: string,
    status: Status
): IGroStatsEthereum => {
    const value = (status === Status.OK) ? toStr(0) : NA;
    return {
        'status': Status.ERROR,
        'current_timestamp': currentTimestamp,
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
            "pwrd": value,
            "gvt": value,
            "total": value,
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
            'vault': [],
        },
        'exposure': {
            'stablecoins': [],
            'protocols': [],
        },
        'token_price_usd': {
            "pwrd": NA,
            "gvt": NA,
            "gro": NA,
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
}

export const emptyGroStatsAvax = (
    status: Status
): IGroStatsAvalanche => {
    const value = (status === Status.OK) ? toStr(0) : NA;
    return {
        'status': Status.ERROR,
        'network': NetworkName.AVALANCHE,
        'launch_timestamp': LAUNCH_TIMESTAMP_AVAX,
        'tvl': {
            "groDAI.e_vault": value,
            "groUSDC.e_vault": value,
            "groUSDT.e_vault": value,
            "groDAI.e_vault_v1_5": value,
            "groUSDC.e_vault_v1_5": value,
            "groUSDT.e_vault_v1_5": value,
            "groDAI.e_vault_v1_6": value,
            "groUSDC.e_vault_v1_6": value,
            "groUSDT.e_vault_v1_6": value,
            "groDAI.e_vault_v1_7": value,
            "groUSDC.e_vault_v1_7": value,
            "groUSDT.e_vault_v1_7": value,
            "total": value,
        },
        'token_price_usd': {
            'avax': value,
        },
        'labs_vault': [],
    }
}



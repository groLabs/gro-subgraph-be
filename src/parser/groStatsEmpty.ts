import { toStr } from '../utils/utils';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';
import { IExposure } from '../interfaces/groStats/ethereum/IExposure';
import {
    Status,
    NetworkName,
} from '../types';
import {
    NA,
    LAUNCH_TIMESTAMP_ETH,
    LAUNCH_TIMESTAMP_AVAX,
} from '../constants';
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
            'amount': value,
            'last3d_apy': value,
            'lifeguard': {
                "amount": value,
                "share": value,
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

export const EMPTY_STRATEGY: IStrategy = {
    'name': NA,
    'display_name': NA,
    'metacoin': NA,
    'protocol': NA,
    'address': '0x',
    'amount': toStr(0),
    'last3d_apy': toStr(0),
    'share': toStr(0),
    'last_update': 0,
}

export const EMPTY_VAULT: IVault = {
    "amount": "0",
    "display_name": NA,
    "last3d_apy": "0",
    "name": NA,
    "reserves": {
        "amount": "0",
        "display_name": NA,
        "last3d_apy": "0",
        "name": NA,
        "share": "0"
    },
    "share": "0.4961491517610466",
    "strategies": [EMPTY_STRATEGY],
}

export const EMPTY_EXPOSURE: IExposure = {
    'stablecoins': [],
    'protocols': [],
}

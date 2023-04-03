import { toStr } from '../utils/utils';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IVault as IVaultAvax } from '../interfaces/groStats/avalanche/IVault';
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


/// @notice Creates empty Gro protocol statistics objects with default values
/// @dev Used to initialize or return when data is not available or when there is an error
/// @param currentTimestamp The current timestamp as a string
/// @param status The status of the Gro protocol statistics (Status.OK or Status.ERROR)
/// @return An empty IGroStats object with default values
export const emptyGroStats = (
    currentTimestamp: string,
    status: Status
): IGroStats => {
    const value = (status === Status.OK) ? toStr(0) : NA;
    return {
        'gro_stats_mc': {
            'status': Status.ERROR,
            'current_timestamp': currentTimestamp,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'tvl': {
                    'mainnet': value,
                    'avalanche': value,
                    'total': value,
                }
            },
            'mainnet': emptyGroStatsEth(currentTimestamp, status),
            'avalanche': emptyGroStatsAvax(status),
        }
    }
}

/// @notice Creates empty Gro protocol statistics objects with default values for Ethereum
/// @param currentTimestamp The current timestamp as a string
/// @param status The status of the Ethereum Gro protocol statistics (Status.OK or Status.ERROR)
/// @return An empty IGroStatsEthereum object with default values
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
            'current': {
                'pwrd': value,
                'gvt': value,
            },
        },
        'tvl': {
            'pwrd': value,
            'gvt': value,
            'total': value,
            'util_ratio': value,
            'util_ratio_limit': value,
        },
        'system': {
            'amount': value,
            'last3d_apy': value,
            'vault': [],
        },
        'exposure': {
            'stablecoins': [],
            'protocols': [],
        },
        'token_price_usd': {
            'pwrd': NA,
            'gvt': NA,
            'gro': NA,
            'uniswap_gvt_gro': NA,
            'uniswap_gro_usdc': NA,
            'balancer_gro_weth': NA,
            'curve_pwrd3crv': NA,
        },
        'pools': [],
    }
}

/// @notice Creates empty Gro protocol statistics objects with default values for Avalanche
/// @param status The status of the Avalanche Gro protocol statistics (Status.OK or Status.ERROR)
/// @return An empty IGroStatsAvalanche object with default values
export const emptyGroStatsAvax = (
    status: Status
): IGroStatsAvalanche => {
    const value = (status === Status.OK) ? toStr(0) : NA;
    return {
        'status': Status.ERROR,
        'network': NetworkName.AVALANCHE,
        'launch_timestamp': LAUNCH_TIMESTAMP_AVAX,
        'tvl': {
            'groDAI.e_vault': value,
            'groUSDC.e_vault': value,
            'groUSDT.e_vault': value,
            'groDAI.e_vault_v1_5': value,
            'groUSDC.e_vault_v1_5': value,
            'groUSDT.e_vault_v1_5': value,
            'groDAI.e_vault_v1_6': value,
            'groUSDC.e_vault_v1_6': value,
            'groUSDT.e_vault_v1_6': value,
            'groDAI.e_vault_v1_7': value,
            'groUSDC.e_vault_v1_7': value,
            'groUSDT.e_vault_v1_7': value,
            'total': value,
        },
        'token_price_usd': {
            'avax': value,
        },
        'labs_vault': [],
    }
}

/// @notice Default empty IStrategy object with NA values
export const EMPTY_STRATEGY: IStrategy = {
    'name': NA,
    'display_name': NA,
    'metacoin': NA,
    'protocol': NA,
    'address': NA,
    'amount': NA,
    'last3d_apy': NA,
    'share': NA,
}

/// @notice Default empty IVault object with NA values
export const EMPTY_VAULT: IVault = {
    'amount': NA,
    'display_name': NA,
    'last3d_apy': NA,
    'name': NA,
    'reserves': {
        'amount': NA,
        'display_name': NA,
        'last3d_apy': NA,
        'name': NA,
        'share': NA
    },
    'share': NA,
    'strategies': [EMPTY_STRATEGY],
}

/// @notice Default empty IExposure object with empty arrays
export const EMPTY_EXPOSURE: IExposure = {
    'stablecoins': [],
    'protocols': [],
}

/// @notice Default empty IVaultAvax object with NA values
export const EMPTY_AVAX_VAULT: IVaultAvax = {
    'name': NA,
    'display_name': NA,
    'stablecoin': NA,
    'amount': NA,
    'share': NA,
    'all_time_apy': NA,
    'last3d_apy': NA,
    'reserves': {
        'name': NA,
        'display_name': NA,
        'amount': NA,
        'share': NA,
        'last3d_apy': NA
    },
    'strategies': [{
        'name': NA,
        'display_name': NA,
        'address': NA,
        'amount': NA,
        'share': NA,
        'last3d_apy': NA,
        'all_time_apy': NA,
        'sharpe_ratio': NA,
        'sortino_ratio': NA,
        'romad_ratio': NA,
        'tvl_cap': NA,
        'open_position': {},
        'past_5_closed_positions': [],
    }],
    'avax_exposure': NA,
}

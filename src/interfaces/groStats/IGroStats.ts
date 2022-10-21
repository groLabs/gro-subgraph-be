import { IApy } from './ethereum/IApy';
import { ITvl as ITvlEth } from './ethereum/ITvl';
import { ILifeguard } from './ethereum/ILifeguard';
import { IVault as IVaultEth } from './ethereum/IVault';
import { IExposure } from './ethereum/IExposure';
import { ITokenPriceUsd } from './ethereum/ITokenPriceUsd';
import { IPool } from './ethereum/IPool';
import { IBoost } from './ethereum/IBoost';
import { ITvl as ITvlAvax } from './avalanche/ITvl';
import { IVault as IVaultAvax } from './avalanche/IVault';


export interface IGroStats {
    'current_timestamp': string,
    'network': string,
    'mc_totals': {
        'tvl': {
            'mainnet': string,
            'avalanche': string,
            'total': string,
        }
    },
    'mainnet': {
        'current_timestamp': string,
        'launch_timestamp': string,
        'network': string,
        'apy': IApy,
        'tvl': ITvlEth,
        'system': {
            'total_share': string,
            'total_amount': string,
            'last3d_apy': string,
            'lifeguard': ILifeguard,
            'vault': IVaultEth[],
        },
        'exposure': IExposure,
        'token_price_usd': ITokenPriceUsd,
        'pools': IPool[],
        'pwrdBoost': IBoost,
        'gvtBoost': IBoost,
    },
    'avalanche': {
        'launch_timestamp': string,
        'tvl': ITvlAvax,
        'token_price_usd': {
            'avax': string,
        },
        'labs_vault': IVaultAvax[],
    }
}
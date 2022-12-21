import { IApy } from './ethereum/IApy';
import { IPool } from './ethereum/IPool';
import { IExposure } from './ethereum/IExposure';
import { ITvl as ITvlEth } from './ethereum/ITvl';
import { ITvl as ITvlAvax } from './avalanche/ITvl';
import { IVault as IVaultEth } from './ethereum/IVault';
import { IVault as IVaultAvax } from './avalanche/IVault';
import { ITokenPriceUsd } from './ethereum/ITokenPriceUsd';
import {
    Status,
    NetworkName,
} from '../../types';


export interface IGroStatsEthereum {
    'status': Status,
    'network': NetworkName,
    'current_timestamp': string,
    'launch_timestamp': string,
    'apy': IApy,
    'tvl': ITvlEth,
    'system': {
        'amount': string,
        'last3d_apy': string,
        'vault': IVaultEth[] | null,
    },
    'exposure': IExposure,
    'token_price_usd': ITokenPriceUsd,
    'pools': IPool[] | null,
}

export interface IGroStatsAvalanche {
    'status': Status,
    'network': NetworkName,
    'launch_timestamp': string,
    'tvl': ITvlAvax,
    'token_price_usd': {
        'avax': string,
    },
    'labs_vault': IVaultAvax[] | null,
}

export interface IGroStats {
    'status': Status,
    'current_timestamp': string,
    'network': string,
    'mc_totals': {
        'tvl': {
            'mainnet': string,
            'avalanche': string,
            'total': string,
        }
    },
    'mainnet': IGroStatsEthereum,
    'avalanche': IGroStatsAvalanche,
}
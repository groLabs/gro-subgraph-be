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
    readonly 'status': Status,
    readonly 'network': NetworkName,
    readonly 'current_timestamp': string,
    readonly 'launch_timestamp': string,
    readonly 'apy': IApy,
    readonly 'tvl': ITvlEth,
    readonly 'system': {
        readonly 'amount': string,
        readonly 'last3d_apy': string,
        readonly 'vault': IVaultEth[] | null,
    },
    readonly 'exposure': IExposure,
    readonly 'token_price_usd': ITokenPriceUsd,
    readonly 'pools': IPool[] | null,
}

export interface IGroStatsAvalanche {
    readonly 'status': Status,
    readonly 'network': NetworkName,
    readonly 'launch_timestamp': string,
    readonly 'tvl': ITvlAvax,
    readonly 'token_price_usd': {
        readonly 'avax': string,
    },
    readonly 'labs_vault': IVaultAvax[] | null,
}

export interface IGroStats {
    'gro_stats_mc': {
        readonly 'status': Status,
        readonly 'current_timestamp': string,
        readonly 'network': string,
        readonly 'mc_totals': {
            readonly 'tvl': {
                readonly 'mainnet': string,
                readonly 'avalanche': string,
                readonly 'total': string,
            }
        },
        readonly 'mainnet': IGroStatsEthereum,
        readonly 'avalanche': IGroStatsAvalanche,
    }
}
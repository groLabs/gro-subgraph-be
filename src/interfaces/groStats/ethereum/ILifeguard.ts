import { IStablecoins } from './IStablecoins';

export interface ILifeguard {
    'stablecoins': IStablecoins[],
    'name': string,
    'display_name': string,
    'amount': string,
    'share': string,
    'last3d_apy': string,
}

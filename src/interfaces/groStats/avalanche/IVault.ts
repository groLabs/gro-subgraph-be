import { IReserve } from './IReserve';
import { IStrategy } from './IStrategy';

export interface IVault {
    readonly 'name': string,
    readonly 'display_name': string,
    readonly 'stablecoin': string,
    readonly 'amount': string,
    readonly 'share': string,
    readonly 'all_time_apy': string,
    readonly 'last3d_apy': string,
    readonly 'reserves': IReserve,
    readonly 'strategies': IStrategy[],
    readonly 'avax_exposure': string,
}

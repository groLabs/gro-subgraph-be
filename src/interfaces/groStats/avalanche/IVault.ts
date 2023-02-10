import { IReserve } from './IReserve';
import { IStrategy } from './IStrategy';


export interface IVault {
    'name': string,
    'display_name': string,
    'stablecoin': string,
    'amount': string,
    'share': string,
    'all_time_apy': string,
    'last3d_apy': string,
    'reserves': IReserve,
    'strategies': IStrategy[],
    'avax_exposure': string,
}

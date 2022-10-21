import { IStrategy } from './IStrategy';

export interface IVault {
    'name': string,
    'display_name': string,
    'amount': string,
    'share': string,
    'last3d_apy': string,
    'reserves': {
        'name': string,
        'display_name': string,
        'amount': string,
        'last3d_apy': string,
        'share': string
    },
    'strategies': IStrategy[],
}

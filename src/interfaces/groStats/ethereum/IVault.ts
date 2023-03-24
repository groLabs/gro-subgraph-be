import { IStrategy } from './IStrategy';

export interface IVault {
    readonly 'name': string,
    readonly 'display_name': string,
    readonly 'amount': string,
    readonly 'share': string,
    readonly 'last3d_apy': string,
    readonly 'reserves': {
        readonly 'name': string,
        readonly 'display_name': string,
        readonly 'amount': string,
        readonly 'last3d_apy': string,
        readonly 'share': string
    },
    readonly 'strategies': IStrategy[],
}

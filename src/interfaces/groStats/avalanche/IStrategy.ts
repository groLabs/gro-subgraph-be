import { IClosedPosition } from './IClosedPosition';

export interface IStrategy {
    readonly 'name': string,
    readonly 'display_name': string,
    readonly 'address': string,
    readonly 'amount': string,
    readonly 'share': string,
    readonly 'last3d_apy': string,
    readonly 'all_time_apy': string,
    readonly 'sharpe_ratio': string,
    readonly 'sortino_ratio': string,
    readonly 'romad_ratio': string,
    readonly 'tvl_cap': string,
    readonly 'open_position': {},
    readonly 'past_5_closed_positions': IClosedPosition[],
}

import { IClosedPosition } from './IClosedPosition';

export interface IStrategy {
    'name': string,
    'display_name': string,
    'address': string,
    'amount': string,
    'share': string,
    'last3d_apy': string,
    'all_time_apy': string,
    'sharpe_ratio': string,
    'sortino_ratio': string,
    'romad_ratio': string,
    'tvl_cap': string,
    'open_position': {},
    'past_5_closed_positions': IClosedPosition[],
}

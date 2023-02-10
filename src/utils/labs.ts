import { Status } from '../types';
import { toStr } from '../utils/utils';
import { ITvl } from '../interfaces/groStats/avalanche/ITvl';
import { IVault } from '../interfaces/groStats/avalanche/IVault';
import { IStrategy } from '../interfaces/groStats/avalanche/IStrategy';
import { emptyGroStatsAvax } from '../parser/groStatsEmpty';


export const getLabs = (_strats: any[]): IVault[] => {
    let vaults: IVault[] = [];
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        const strat: IStrategy = {
            'name': str.strat_name,
            'display_name': str.strat_display_name,
            'address': str.id,
            'amount': str.total_assets_strategy,
            'share': toStr(0),
            'last3d_apy': toStr(0),
            'all_time_apy': toStr(0),
            'sharpe_ratio': toStr(0),
            'sortino_ratio': toStr(0),
            'romad_ratio': toStr(0),
            'tvl_cap': toStr(2000000),
            'open_position': {},
            'past_5_closed_positions': [],
        }
        const vault: IVault = {
            'name': str.vault_name,
            'display_name': str.vault_display_name,
            'stablecoin': str.coin,
            'amount': str.total_assets_vault,
            'share': toStr(0), // TBC
            'all_time_apy': toStr(0), // TBC
            'last3d_apy': toStr(0), // TBC
            'reserves': {
                'name': str.vault_name,
                'display_name': str.vault_display_name,
                'amount': str.total_assets_vault,
                'share': toStr(0), // TBC
                'last3d_apy': toStr(0),
            },
            'strategies': [strat],
            'avax_exposure': toStr(0),
        }

        vaults.push(vault);
    }
    return vaults;
}

export const getTvl = (_strats: any[]): ITvl => {
    let tvl: ITvl = emptyGroStatsAvax(Status.OK).tvl;
    let totalTvl = 0;
    for (let i = 0; i < _strats.length; i++) {
        const strat = _strats[i];
        const vault = strat.vault_name as any;
        tvl[vault as keyof ITvl] = strat.total_assets_vault;
        totalTvl += parseFloat(strat.total_assets_vault);
    }
    tvl['total'] = toStr(totalTvl);
    return tvl;
}

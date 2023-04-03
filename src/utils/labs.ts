import { Status } from '../types';
import { toStr } from '../utils/utils';
import { getLabsData as getData} from '../data/labs';
import { emptyGroStatsAvax } from '../parser/groStatsEmpty';
import { ITvl } from '../interfaces/groStats/avalanche/ITvl';
import { IVault } from '../interfaces/groStats/avalanche/IVault';
import { IStrategy } from '../interfaces/groStats/avalanche/IStrategy';


/// @notice Generates an array of IVault objects based on the input Avax strategies and TVL
/// @dev Calculates vault shares, strategy shares, and reserve assets from the given strategies and TVL
/// @param _strats An array of strategy objects with various properties
/// @param tvl The total value locked (TVL) across all vaults
/// @return An array of IVault objects containing information about the vaults and their associated strategies
export const getLabs = (
    _strats: any[],
    tvl: number,
): IVault[] => {
    let vaults: IVault[] = [];
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        const data = getData(str.vault_name);
        const vaultAsset = parseFloat(str.total_assets_vault);
        const vaultShare = (tvl > 0)
            ? vaultAsset / tvl
            : 0;
        const stratAsset = parseFloat(str.total_assets_strategy);
        const stratShare = (vaultAsset > 0)
            ? stratAsset / vaultAsset
            : 0;
        const reservesAsset = (vaultShare > 0)
            ? (vaultAsset - stratAsset) / tvl
            : 0;
        const strat: IStrategy = {
            'name': str.strat_name,
            'display_name': str.strat_display_name,
            'address': str.id,
            'amount': str.total_assets_strategy,
            'share': toStr(stratShare),
            'last3d_apy': data.strategies[0].last3d_apy,
            'all_time_apy': data.strategies[0].all_time_apy,
            'sharpe_ratio': data.strategies[0].sharpe_ratio,
            'sortino_ratio': data.strategies[0].sortino_ratio,
            'romad_ratio': data.strategies[0].romad_ratio,
            'tvl_cap': str.tvl_cap,
            'open_position': {},
            'past_5_closed_positions': data.strategies[0].past_5_closed_positions,
        }
        const vault: IVault = {
            'name': str.vault_name,
            'display_name': str.vault_display_name,
            'stablecoin': str.coin,
            'amount': str.total_assets_vault,
            'share': toStr(vaultShare),
            'all_time_apy': data.all_time_apy,
            'last3d_apy': data.last3d_apy,
            'reserves': {
                'name': str.vault_name,
                'display_name': str.vault_display_name,
                'amount': str.total_assets_vault,
                'share': toStr(reservesAsset),
                'last3d_apy': toStr(0),
            },
            'strategies': [strat],
            'avax_exposure': data.avax_exposure,
        }
        vaults.push(vault);
    }
    return vaults;
}

/// @notice Calculates the TVL for each vault and the total TVL across all vaults
/// @dev Iterates through the input strategies and aggregates the total assets for each vault and the total TVL
/// @param _strats An array of strategy objects with various properties
/// @return An ITvl object containing the TVL for each vault and the total TVL across all vaults
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

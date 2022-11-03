import { Token } from '../types';
import { toStr } from '../utils/utils';
import { STABLECOINS } from '../constants';
import { EMPTY_VAULT } from '../parser/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';


const calcVaultData = (
    _strats: any[],
    coin: Token,
): IVault => {
    let maxTimestamp = 0;
    let totalDebt = 0;
    let totalAssets = 0;
    let vaultName = '';
    let vaultDisplayName = '';
    let strats: IStrategy[] = [];
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        if (str.coin === coin) {
            // get adapter assets from the latest updated strategy
            if (
                str.block_strategy_reported > maxTimestamp
                || str.block_hourly_update > maxTimestamp
            ) {
                maxTimestamp = (str.block_hourly_update > str.block_strategy_reported)
                    ? str.block_hourly_update
                    : str.block_strategy_reported;
                totalAssets = parseFloat(str.total_assets_adapter);
                vaultName = str.vault_name;
                vaultDisplayName = str.vault_display_name;
            }
            totalDebt += parseFloat(str.strategy_debt);
            const strat = {
                'name': str.strat_name,
                'display_name': str.strat_display_name,
                'address': str.id,
                'amount': str.total_assets_strategy,
                'last3d_apy': '0',
                'share': '0',
                'last_update': maxTimestamp,
            }
            strats.push(strat);
        }
    }
    if (strats.length > 0) {
        return {
            'name': vaultName,
            'display_name': vaultDisplayName,
            'amount': toStr(totalAssets),
            'share': '--',
            'last3d_apy': '--',
            'reserves': {
                'name': vaultName,
                'display_name': vaultName,
                'amount': toStr(totalAssets - totalDebt),
                'last3d_apy': '--',
                'share': '--',
            },
            'strategies': strats,
        }
    } else {
        return EMPTY_VAULT;
    }
}

const updateShares = (
    vaults: IVault[],
    totalAmount: number
): IVault[] => {
    for (let i = 0; i < vaults.length; i++) {
        let vault = vaults[i];
        const vaultAmount = parseFloat(vault.amount);
        vault.share = (vaultAmount > 0)
            ? toStr((vaultAmount / totalAmount))
            : toStr(0);
        const reservesAmount = parseFloat(vault.reserves.amount);
        vault.reserves.share = (reservesAmount > 0)
            ? toStr((reservesAmount / totalAmount))
            : toStr(0);
        for (let x = 0; x < vault.strategies.length; x++) {
            let strat = vault.strategies[x];
            const stratAmount = parseFloat(strat.amount);
            strat.share = (stratAmount > 0)
                ? toStr((stratAmount / totalAmount))
                : toStr(0);
        }
    }
    return vaults;
}

export const getVaults = (strats: any[]): IVault[] | null => {
    let result: IVault[] = [];
    for (let i = 0; i < STABLECOINS.length; i++) {
        const vaults = calcVaultData(strats, STABLECOINS[i]);
        result.push(vaults);
    }
    const totalAmount = result.reduce((val, item) => val + parseFloat(item.amount), 0);
    result = updateShares(result, totalAmount);
    return (result.length > 0) ? result : null;
}

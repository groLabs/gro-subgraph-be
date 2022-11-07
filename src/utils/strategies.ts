import { Token } from '../types';
import { toStr, now as _now } from '../utils/utils';
import {
    TS_1D,
    TS_7D,
    TS_15D,
    STABLECOINS,
    DEFAULT_STRATEGY_APY
} from '../constants';
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
                'last3d_apy': calcStratAPY(parseFloat(str.total_assets_strategy), str.harvests, str.id),
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

// Update shares on vaults based on strategy shares
const updateShares = (
    vaults: IVault[],
    totalAmount: number
): IVault[] => {
    for (let i = 0; i < vaults.length; i++) {
        let vault = vaults[i];
        const vaultAmount = parseFloat(vault.amount);
        vault.share = (totalAmount > 0)
            ? toStr((vaultAmount / totalAmount))
            : toStr(0);
        const reservesAmount = parseFloat(vault.reserves.amount);
        vault.reserves.share = (totalAmount > 0)
            ? toStr((reservesAmount / totalAmount))
            : toStr(0);
        for (let x = 0; x < vault.strategies.length; x++) {
            let strat = vault.strategies[x];
            const stratAmount = parseFloat(strat.amount);
            strat.share = (totalAmount > 0)
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

export const calcStratAPY = (
    totalAmount: number,
    harvests: any[],
    strategyAddress: string,
): string => {
    let netProfit = 0;
    let latestTS = 0;
    let latestTS_7d15d = 0;
    let now = parseInt(_now());
    for (let i = 0; i < harvests.length; i++) {
        let harvest = harvests[i];
        if (harvest.strategyAddress.id === strategyAddress) {
            if (harvest.timestamp >= now - TS_7D) {
                netProfit += harvest.gain - harvest.loss;
                if (harvest.timestamp > latestTS)
                    latestTS = harvest.timestamp;
            }
            if ((harvest.timestamp < now - TS_7D)
                && (harvest.timestamp >= now - TS_15D)
                && (harvest.timestamp > latestTS_7d15d)
            ) {
                console.log('in! harvest.timestamp', harvest.timestamp, 'now - TS_7D', now - TS_7D, 'now - TS_15D', now - TS_15D);
                latestTS_7d15d = harvest.timestamp;
            }
        }
    }

    if (latestTS_7d15d > 0) {
        const days = (latestTS - latestTS_7d15d) / TS_1D;
        const apy = (netProfit / totalAmount) * (365 / days);
        console.log('strat', strategyAddress, 'netProfit', netProfit, 'totalAmount', totalAmount, 'now', now, '7d', now - TS_7D, '15d', now - TS_7D)
        console.log('latestTS', latestTS, 'latestTS_7d15d', latestTS_7d15d, 'days', (latestTS - latestTS_7d15d) / TS_1D, 'apy', apy);
        return toStr(apy);
    } else {
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    }

}

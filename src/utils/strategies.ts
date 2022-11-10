import { Token } from '../types';
import { EMPTY_VAULT } from '../parser/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';
import {
    toStr,
    now as _now
} from '../utils/utils';
import {
    TS_1D,
    TS_7D,
    DEFAULT_STRATEGY_APY
} from '../constants';


// @dev: calc vault & strategies data per vault stablecoin
const calcVaultData = (
    _strats: any[],
    coin: Token,
): IVault => {
    let maxTimestamp = 0;
    let totalDebt = 0;
    let vaultAssets = 0;
    let strategyAssets = 0;
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
                vaultAssets = parseFloat(str.total_assets_adapter);
                vaultName = str.vault_name;
                vaultDisplayName = str.vault_display_name;
            }
            totalDebt += parseFloat(str.strategy_debt);
            strategyAssets += parseFloat(str.total_assets_strategy);
            const strat = {
                'name': str.strat_name,
                'display_name': str.strat_display_name,
                'metacoin': str.metacoin,
                'protocol': str.protocol,
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
            'amount': toStr(vaultAssets),
            'share': '--',
            'last3d_apy': '--',
            'reserves': {
                'name': vaultName,
                'display_name': vaultName,
                // 'amount': toStr(vaultAssets - totalDebt),
                'amount': toStr(vaultAssets - strategyAssets),
                'last3d_apy': toStr(0),
                'share': '--',
            },
            'strategies': strats,
        }
    } else {
        return EMPTY_VAULT;
    }
}

// Update shares on vaults based on strategy shares
// totalAmount: sum of all vault amounts
const updateShares = (
    vaults: IVault[],
    totalAmount: number
): IVault[] => {
    for (let i = 0; i < vaults.length; i++) {
        let vault = vaults[i];
        let apy = 0;
        // update vault share
        const vaultAmount = parseFloat(vault.amount);
        vault.share = (totalAmount > 0)
            ? toStr((vaultAmount / totalAmount))
            : toStr(0);
        // update reserves share
        const reservesAmount = parseFloat(vault.reserves.amount);
        vault.reserves.share = (totalAmount > 0)
            ? toStr((reservesAmount / totalAmount))
            : toStr(0);
        for (let x = 0; x < vault.strategies.length; x++) {
            // update strategy shares
            let strat = vault.strategies[x];
            const stratAmount = parseFloat(strat.amount);
            strat.share = (totalAmount > 0)
                ? toStr((stratAmount / totalAmount))
                : toStr(0);
            apy += parseFloat(strat.last3d_apy) * parseFloat(strat.share);
        }
        // update vault apy
        const vaultShare = parseFloat(vault.share);
        vault.last3d_apy = (vaultShare > 0) ? toStr(apy / vaultShare) : '0';
    }
    return vaults;
}

//@dev: apy = ( net profit / total assets ) * ( 365 / n ) , where:
//      net profit = gain - loss of harvests between the last harvest and the latest harvest after 7d
//      total assets = current strategy total assets
//      n = diff in days between latest harvest timestamp and latest harvest timestamp between last 7d & 15d
export const calcStratAPY = (
    totalAmount: number,
    harvests: any[],
    strategyAddress: string,
): string => {
    let netProfit = 0;
    const maxHarvestTS = Math.max(...harvests.map(item => item.timestamp));
    const maxHarvest7dTS = Math.max(...harvests.map(item => (item.timestamp <= maxHarvestTS - TS_7D) ? item.timestamp : 0));
    const days = (maxHarvestTS - maxHarvest7dTS) / TS_1D;

    for (let i = 0; i < harvests.length; i++) {
        let harvest = harvests[i];
        if (harvest.timestamp > maxHarvest7dTS) {
            netProfit += harvest.gain - harvest.loss;
        }
    }
    if (maxHarvest7dTS > 0) {
        const apy = (netProfit / totalAmount) * (365 / days);
        return toStr(apy);
    } else {
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    }
}

export const calcSystemAPY = (
    vaults: IVault[],
): string => {
    let apy = 0;
    for (let i = 0; i < vaults.length; i++) {
        let vault = vaults[i];
        apy += parseFloat(vault.last3d_apy) * parseFloat(vault.share);
    }
    return toStr(apy);
}

export const getSystem = (strats: any[]) => {
    let vaults: IVault[] = [];
    const stablecoins = [
        Token.DAI,
        Token.USDC,
        Token.USDT,
    ];
    for (let i = 0; i < stablecoins.length; i++) {
        const vault = calcVaultData(strats, stablecoins[i]);
        vaults.push(vault);
    }
    // sum all vault amounts
    const totalAmount = vaults.reduce((val, item) => val + parseFloat(item.amount), 0);
    vaults = updateShares(vaults, totalAmount);
    const systemAPY = (vaults) ? calcSystemAPY(vaults) : toStr(0);
    const system = {
        'amount': toStr(totalAmount),
        'last3d_apy': systemAPY,
        'lifeguard': {
            "amount": toStr(0),
            "share": toStr(0),
        },
        'vault': vaults,
    }
    return system;
}
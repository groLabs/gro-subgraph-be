import { Token } from '../types';
import { EMPTY_VAULT } from '../parser/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';
import {
    toStr,
    now as _now
} from '../utils/utils';


// @dev: calc vault & strategies data per vault stablecoin
const calcVaultData = (
    _strats: any[],
    coin: Token,
    tvl: number,
    threeCrvPrice: number,
): IVault => {
    let maxTimestamp = 0;
    let totalDebt = 0;
    // all tranche assets are in gVault
    let vaultAssets = tvl;
    let strategyAssets = 0;
    let totalLoss = 0;
    let vaultName = '3CRV';
    let vaultDisplayName = '3CRV yVault';
    let strats: IStrategy[] = [];
    let latestHarvest;
    // TODO: hardcode the release factor. It may be changed in the contract
    let releaseFactor = 86400 * 7;
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        if (str.coin.toLowerCase() === coin) {
            totalDebt += parseFloat(str.strategy_debt);
            const strategyAssetsUsd = parseFloat(str.strategy_debt) * threeCrvPrice;
            strategyAssets += strategyAssetsUsd;
            const strat = {
                'name': str.strat_name,
                'display_name': str.strat_display_name,
                'metacoin': str.metacoin,
                'protocol': str.protocol,
                'address': str.id,
                'amount': toStr(strategyAssetsUsd),
                'last3d_apy': toStr(0),
                'share': toStr(strategyAssetsUsd / tvl),
                'last_update': maxTimestamp,
            }
            strats.push(strat);
            // Find the latest record of harvest. It contains the latest lockedProfit value
            if (str.harvests!= undefined) {
                for (let i = 0; i < str.harvests.length; i++) {
                    let harvest = str.harvests[i];
                    totalLoss += parseFloat(harvest.loss);
                    if (latestHarvest == undefined || harvest.timestamp > latestHarvest.timestamp) {
                        latestHarvest = harvest
                    }
                }
            }

        }
    }
    if (strats.length > 0) {
        // The lockedProfit and totalLoss are in 3crv. Need covert them to USD
        let netProfitUsd = latestHarvest ? (latestHarvest.lockedProfit - totalLoss) * threeCrvPrice : 0
        let vaultApy = ((netProfitUsd * 365.25 * 86400) / releaseFactor) / tvl
        return {
            'name': vaultName,
            'display_name': vaultDisplayName,
            'amount': toStr(vaultAssets),
            'share': '1.0',
            'last3d_apy': toStr(vaultApy),
            'reserves': {
                'name': vaultName,
                'display_name': vaultDisplayName,
                // 'amount': toStr(vaultAssets - totalDebt),
                'amount': toStr(vaultAssets - strategyAssets),
                'last3d_apy': toStr(0),
                'share': toStr((vaultAssets - strategyAssets) / tvl),
            },
            'strategies': strats,
        }
    } else {
        return EMPTY_VAULT;
    }
}

export const getSystem = (strats: any[], tvl: number, threeCrvPrice: number) => {
    let vaults: IVault[] = [];
    // only one 3crv vault. All assets are in tvl
    const vault = calcVaultData(strats, Token.THREE_CRV, tvl, threeCrvPrice);
    
    const systemAPY = vault ? vault.last3d_apy : toStr(0);
    vaults.push(vault);

    const system = {
        'amount': toStr(tvl),
        'last3d_apy': systemAPY,
        'vault': vaults,
    }
    return system;
}
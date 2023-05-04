import {
    toStr,
    now as _now
} from './utils';
import { DEFAULT_STRATEGY_APY } from '../constants';
import { EMPTY_VAULT } from '../parser/groStats/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';



// TODO: one function for VAULTS and one function for STRATEGIES, or even do it in two files: strategies & valts

//@dev: all tranche assets are in GVault
const calcVaultData = (
    _strats: any[],
    tvl: number,
    threeCrvPrice: number,
    releaseFactor: number,
): IVault => {
    let maxTimestamp = 0;
    let vaultAssets = tvl;
    let strategyAssets = 0;
    let totalLoss = 0;
    let strats: IStrategy[] = [];
    let latestHarvest;
    let releaseFactor7d = releaseFactor * 7;

    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        const strategyAssetsUsd = parseFloat(str.strategy_debt) * threeCrvPrice;
        strategyAssets += strategyAssetsUsd;
        const strat = {
            'name': str.strat_name,
            'display_name': str.strat_display_name,
            'metacoin': str.metacoin,
            'protocol': str.protocol,
            'address': str.id,
            'amount': toStr(strategyAssetsUsd),
            'last3d_apy': calcStratAPY(
                tvl,
                str.harvests,
                str.id
            ),
            'share': toStr(strategyAssetsUsd / tvl),
            // 'last_update': maxTimestamp,
        }
        strats.push(strat);

        // Find the latest record of harvest. It contains the latest lockedProfit value
        if (str.harvests != undefined) {
            for (let i = 0; i < str.harvests.length; i++) {
                let harvest = str.harvests[i];
                totalLoss += parseFloat(harvest.loss);
                if (latestHarvest == undefined || harvest.timestamp > latestHarvest.timestamp) {
                    latestHarvest = harvest
                }
            }
        }
    }

    let vaultName = '3CRV';
    let vaultDisplayName = '3CRV yVault';
    if (strats.length > 0) {
        // The lockedProfit and totalLoss are in 3CRV, so needs convertion to USD
        let netProfitUsd = latestHarvest ? (latestHarvest.lockedProfit/* - totalLoss*/) * threeCrvPrice : 0
        let vaultApy = ((netProfitUsd * 365.25 * 86400) / releaseFactor7d) / tvl
        console.log('latestHarvest.lockedProfit', latestHarvest.lockedProfit, 'totalLoss', totalLoss, 'threeCrvPrice', threeCrvPrice, 'netProfitUsd', netProfitUsd, 'releaseFactor', releaseFactor7d);
        return {
            'name': vaultName,
            'display_name': vaultDisplayName,
            'amount': toStr(vaultAssets),
            'share': '1.0',
            'last3d_apy': toStr(vaultApy),
            'reserves': {
                'name': vaultName,
                'display_name': vaultDisplayName,
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

export const getSystem = (
    strats: any[],
    tvl: number,
    threeCrvPrice: number,
    releaseFactor: number,
) => {
    let vaults: IVault[] = [];
    // only one 3CRV vault instread of DAI/USDC/USDT vaults. All assets are in TVL
    const vault = calcVaultData(
        strats,
        tvl,
        threeCrvPrice,
        releaseFactor
    );

    const systemAPY = vault ? vault.last3d_apy : toStr(0);
    vaults.push(vault);

    const system = {
        'amount': toStr(tvl),
        'last3d_apy': systemAPY,
        'vault': vaults,
    }
    return system;
}

//@dev: apy = ( net profit / tvl ) * ( 365 / 7 ) , where:
//      net profit = gain - loss of harvests in the last 7 days
export const calcStratAPY = (
    tvl: number,
    _harvests: any[],
    strategyAddress: string,
): string => {
    let netProfit = 0;
    let harvests = _harvests.filter((item: any) => item.strategyAddress.id === strategyAddress);
    for (let i = 0; i < harvests.length; i++) {
        netProfit += harvests[i].gain - harvests[i].loss;
    }
    if (harvests.length > 0) {
        const apy = (netProfit / tvl) * (365 / 7);
        return toStr(apy);
    } else {
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    }
}

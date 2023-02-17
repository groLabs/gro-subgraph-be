import { DEFAULT_STRATEGY_APY } from '../constants';
import { EMPTY_VAULT } from '../parser/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';
import {
    toStr,
    now as _now
} from '../utils/utils';


// @dev: strategy apy = ( net profit / tvl ) * ( 365 / 7 ) , where:
//       net profit = gain - loss in USD of harvests within the last 7 days
export const calcStrategyApy = (
    tvl: number,
    _harvests: any[],
    strategyAddress: string,
    threeCrvPrice: number,
): string => {
    let netProfit = 0;
    let harvests = _harvests.filter((item: any) => item.strategyAddress.id === strategyAddress);
    for (let i = 0; i < harvests.length; i++) {
        netProfit += (harvests[i].gain - harvests[i].loss) * threeCrvPrice;
    }
    if (tvl === 0) {
        return toStr(0);
    } else if (harvests.length > 0) {
        const apy = (netProfit / tvl) * (365 / 7);
        return toStr(apy);
    } else {
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    }
}

const calcStrategies = (
    _strats: any[],
    tvl: number,
    threeCrvPrice: number,
): IStrategy[] => {
    let strats: IStrategy[] = [];
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        const strategyAssetsUsd = parseFloat(str.strategy_debt) * threeCrvPrice;
        const strat = {
            'name': str.strat_name,
            'display_name': str.strat_display_name,
            'metacoin': str.metacoin,
            'protocol': str.protocol,
            'address': str.id,
            'amount': toStr(strategyAssetsUsd),
            'last3d_apy': calcStrategyApy(
                tvl,
                str.harvests,
                str.id,
                threeCrvPrice,
            ),
            'share': toStr(tvl > 0 ? strategyAssetsUsd / tvl : 0),
        }
        strats.push(strat);
    }
    return strats;
}

// V1
//@dev: vault apy = ( ( lockedProfit * 365 * 86400) / releaseFactor ) / tvl )
const calcVault = (
    _strats: any[],
    strats: IStrategy[],
    tvl: number,
    release_factor: number,
    lockedProfit: number,
    threeCrvPrice: number,
): IVault => {
    const vaultApy = (release_factor > 0 && tvl > 0)
        ? ((lockedProfit * threeCrvPrice * 365 * 86400) / release_factor) / tvl
        : 0;
    const strategyAssets = strats.reduce((prev, current) => prev + parseFloat(current.amount), 0);
    const reservesAmount = tvl - strategyAssets;
    if (strats.length > 0) {
        return {
            'name': '3CRV',
            'display_name': '3CRV yVault',
            'amount': toStr(tvl),
            'share': '1.0',
            'last3d_apy': toStr(vaultApy),
            'reserves': {
                'name': '3CRV',
                'display_name': '3CRV yVault',
                'amount': toStr(reservesAmount),
                'last3d_apy': toStr(0),
                'share': toStr(tvl > 0 ? reservesAmount / tvl : 0),
            },
            'strategies': strats,
        }
    } else {
        return EMPTY_VAULT;
    }
}

//@dev: With G^2, only one CRV Vault (aka GVault) instead of DAI, USDC & USDT Vaults
export const getSystem = (
    strats: any[],
    tvl: number,
    threeCrvPrice: number,
    releaseFactor: number,
    lockedProfit: number,
) => {
    const strategies = calcStrategies(
        strats,
        tvl,
        threeCrvPrice,
    );
    const vault = calcVault(
        strats,
        strategies,
        tvl,
        releaseFactor,
        lockedProfit,
        threeCrvPrice,
    );
    //TODO: systemAPY is not vaultAPY
    const systemAPY = vault
        ? vault.last3d_apy
        : toStr(0);
    const system = {
        'amount': toStr(tvl),
        'last3d_apy': systemAPY,
        'vault': [vault],
    }
    return system;
}


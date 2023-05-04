import { EMPTY_VAULT } from '../parser/groStats/groStatsEmpty';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IStrategy } from '../interfaces/groStats/ethereum/IStrategy';
import {
    now,
    toStr,
} from './utils';
import {
    TS_1D,
    TS_7D,
    DEFAULT_STRATEGY_APY,
} from '../constants';


/// @notice Calculates the APY for a given strategy based on the TVL, harvests,
///         strategy address, and threeCrv price
/// @dev strategy apy = ( net profit / tvl ) * ( 365 / n ) , where:
///       1) net profit = average(gain - loss) in USD of harvests between the last harvest X and harvests 7d days ago
///       from this last harvest X in a range of 15 days from now.
///       2) n = difference of days between [now] and [last harvest - 7d]
/// @param tvl The total value locked across all vaults
/// @param _harvests An array of harvest events
/// @param strategyAddress The address of the strategy to calculate the APY for
/// @param threeCrvPrice The current price of the 3Crv token
/// @return The APY of the given strategy as a string
export const calcStrategyApy = (
    tvl: number,
    _harvests: any[],
    strategyAddress: string,
    threeCrvPrice: number,
    strategyAsset: number,
): string => {
    let netProfit = 0;
    let numHarvests = 0;
    let harvests = _harvests.filter((item: any) => item.strategy_address.id === strategyAddress);
    const _now = parseInt(now());
    const maxHarvestTS = Math.max(...harvests.map(item => item.block_timestamp));
    const minHarvestTS = maxHarvestTS - TS_7D;
    for (let i = 0; i < harvests.length; i++) {
        if (harvests[i].block_timestamp >= minHarvestTS) {
            netProfit += harvests[i].gain - harvests[i].loss;
            numHarvests++;
        }
    }
    const days = (_now - minHarvestTS) / TS_1D;
    if (harvests.length > 0) {
        // there are harvests, so apy based on latest ones
        const apy = (((netProfit * threeCrvPrice) / numHarvests) / tvl) * (365 / days);
        return toStr(apy);
    } else if (strategyAsset > 0.1) {
        // no harvests but assets, so taking default apy
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    } else {
        // no assets, so 0% apy
        return '0';
    }
}

/// @notice Calculates the properties of an array of IStrategy objects
/// @param _strats An array of strategy objects with various properties
/// @param tvl The total value locked across all vaults
/// @param threeCrvPrice The current price of the 3Crv token
/// @return An array of IStrategy objects containing information about the strategies
const calcStrategies = (
    _strats: any[],
    tvl: number,
    threeCrvPrice: number,
): IStrategy[] => {
    let strats: IStrategy[] = [];
    for (let i = 0; i < _strats.length; i++) {
        let str = _strats[i];
        const strategyAssetsUsd = parseFloat(str.strategy_debt) * threeCrvPrice;
        const stratApy = calcStrategyApy(
            tvl,
            str.harvests,
            str.id,
            threeCrvPrice,
            strategyAssetsUsd,
        );
        const strat = {
            'name': str.strat_name,
            'display_name': str.strat_display_name,
            'metacoin': str.metacoin,
            'protocol': str.protocol,
            'address': str.id,
            'amount': toStr(strategyAssetsUsd),
            'last3d_apy': stratApy,
            'share': toStr(tvl > 0 ? strategyAssetsUsd / tvl : 0),
        }
        strats.push(strat);
    }
    return strats;
}

/// @notice Calculates the properties of a single IVault object
/// @dev vault apy = sum(Strategy APYs)
/// @dev lockedProfit & releaseFactor are not used to calculate Vault APY because this wouldn't reflect
///      negative APYs in case that losses > lockedProfit
/// @param _vault A single vault object with various properties
/// @param strats An array of IStrategy objects
/// @param tvl The total value locked across all vaults
/// @return An IVault object containing information about the given vault
/// @todo If multiple GVaults, reserves can't be TVL - StrategyAssets   (should be GVault.vaultAssets)
const calcVault = (
    _vault: any,
    strats: IStrategy[],
    tvl: number,
): IVault => {
    const vaultApy = strats.reduce((prev, current) => prev + parseFloat(current.last3d_apy), 0);
    const strategyAssets = strats.reduce((prev, current) => prev + parseFloat(current.amount), 0);
    // Strategies are updated on harvest or withdrawal events, whereas tvl is updated on every transfer:
    // reserves could show small negative amounts if no recent harvests + nothing in reserve,
    // therefore, applying 0 in case of negative amount.
    const reservesAmount = (tvl > strategyAssets)
        ? tvl - strategyAssets
        : 0;
    // for (let i = 0; i < strats.length; i++) {
    //     console.log(strats[i]);
    // }
    // const vaultApyV2 = strats.reduce((prev, current) => prev + (parseFloat(current.last3d_apy) * parseFloat(current.amount)) / tvl, 0);
    // console.log('vault incl. reserves', tvl, 'eps', vaultApyV2);
    if (strats.length > 0) {
        return {
            'name': '3CRV',
            'display_name': '3CRV yVault',
            'amount': toStr(tvl),
            'share': '1.0',
            'last3d_apy': toStr(vaultApy),
            // 'last3d_apy': toStr(vaultApyV2),
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


/// @notice Calculates the properties of an ISystem object based on the input
///         gvaults, TVL, and threeCrv price
// /@dev With G^2, only one CRV Vault (aka GVault) instead of DAI, USDC & USDT Vaults
/// @param gvaults An array of gvault objects with various properties
/// @param tvl The total value locked across all vaults
/// @param threeCrvPrice The current price of the 3Crv token
/// @return An ISystem object containing information about the system
export const getSystem = (
    gvaults: any[],
    tvl: number,
    threeCrvPrice: number,
) => {
    let vaults: IVault[] = [];
    for (let i = 0; i < gvaults.length; i++) {
        const strategies = calcStrategies(
            gvaults[i].strategies,
            tvl,
            threeCrvPrice,
        );
        const vault = calcVault(
            gvaults[i],
            strategies,
            tvl,
        );
        vaults.push(vault);
    }
    const systemAPY = vaults.length > 0
        ? toStr(
            vaults.reduce((prev, current) => prev + parseFloat(current.last3d_apy), 0)
        )
        : toStr(0);
    const system = {
        'amount': toStr(tvl),
        'last3d_apy': systemAPY,
        'vault': vaults,
    }
    return system;
}


// @dev: strategy apy = ( net profit / tvl ) * ( 365 / 7 ) , where:
//       net profit = average(gain - loss) in USD of harvests within the last 7 days
// @dev: This calc has been replaced because it would give the default APY in case we
//       don't have any harvest in the last 7d. The new calc considers a 15d window
/*
export const calcStrategyApy2 = (
    tvl: number,
    _harvests: any[],
    strategyAddress: string,
    threeCrvPrice: number,
): string => {
    let netProfit = 0;
    let harvests = _harvests.filter((item: any) => item.strategy_address.id === strategyAddress);
    let numHarvests = harvests.length;
    for (let i = 0; i < numHarvests; i++) {
        netProfit += (harvests[i].gain - harvests[i].loss) * threeCrvPrice;
    }
    if (tvl === 0) {
        return toStr(0);
    } else if (numHarvests > 0) {
        const apy = ((netProfit / numHarvests) / tvl) * (365 / 7);
        return toStr(apy);
    } else {
        const apy = DEFAULT_STRATEGY_APY.get(strategyAddress);
        return apy ? toStr(apy) : '0';
    }
}
*/

// @dev: vault apy = ( ( lockedProfit * 365 * 86400) / releaseFactor ) / tvl )
// @dev: This calc has been replaced because it won't reflect negative APY correctly if
//       losses > lockedProfit
/*
const calcVault = (
    _vault: any,
    strats: IStrategy[],
    tvl: number,
    threeCrvPrice: number,
): IVault => {

    const vaultApy = (_vault.release_factor > 0 && tvl > 0)
        ? ((parseFloat(_vault.locked_profit) * threeCrvPrice * 365 * 86400) / _vault.release_factor) / tvl
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
*/
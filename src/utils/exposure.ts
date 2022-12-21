import { toStr, now as _now } from './utils';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IExposure } from '../interfaces/groStats/ethereum/IExposure';
import { IExposureItem } from '../interfaces/groStats/ethereum/IExposureItem';


export const getExposures = (
    vaults: IVault[],
): IExposure => {
    let stablecoins: IExposureItem[] = [];
    let protocols: IExposureItem[] = [];
    let protocolList = new Map<string, number>();
    let strategyList = new Map<string, number>();
    const totalAmount = vaults.reduce((prev, current) => prev + parseFloat(current.amount), 0);

    for (let i = 0; i < vaults.length; i++) {
        const vault = vaults[i];
        for (let x = 0; x < vault.strategies.length; x++) {
            const strat = vault.strategies[x];
            // store strategy amount per metacoin
            const prevStrat = protocolList.get(strat.metacoin);
            const currStrat = parseFloat(strat.amount)
            strategyList.set(
                strat.metacoin,
                prevStrat ? prevStrat + currStrat : currStrat,
            );
            // store strategy amount per protocol
            const prev = protocolList.get(strat.protocol);
            const curr = parseFloat(strat.amount)
            protocolList.set(
                strat.protocol,
                prev ? prev + curr : curr,
            );
        }
    }

    // Because all assets expose to 3crv, all stablecoin exposures are 100%
    const stableCoinList = ['DAI', 'USDC', 'USDT']
    for (let z = 0; z < stableCoinList.length; z++) {
        const token = stableCoinList[z];
        stablecoins.push({
            'concentration': toStr(1.0),
            'display_name': token,
            'name': token,
        });
    }

    // calc metacoin exposure
    strategyList.forEach((value, key) => {
        stablecoins.push({
            'concentration': toStr(value / totalAmount),
            'display_name': key.toUpperCase(),
            'name': key.toUpperCase(),
        })
    })

    // Because all assets expose to 3crv, the curve exposure is 100%
    protocols.push({
        'concentration': toStr(1.0),
        'display_name': 'CURVE',
        'name': 'CURVE',
    });

    protocolList.forEach((value, key) => {
        protocols.push({
            'concentration': toStr(value / totalAmount),
            'display_name': key.toUpperCase(),
            'name': key.toUpperCase(),
        });
    });

    return {
        protocols: protocols,
        stablecoins: stablecoins,
    }
}
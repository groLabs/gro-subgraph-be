import { toStr, now as _now } from './utils';
import { IVault } from '../interfaces/groStats/ethereum/IVault';
import { IExposure } from '../interfaces/groStats/ethereum/IExposure';
import { IExposureItem } from '../interfaces/groStats/ethereum/IExposureItem';


export const getExposures = (
    vaults: IVault[],
): IExposure => {
    let stablecoins: IExposureItem[] = [];
    let protocols: IExposureItem[] = [];
    let reserveDai = 0;
    let reserveUsdc = 0;
    let reserveUsdt = 0;
    let reservesTotal = 0;
    let protocolList = new Map<string, number>();
    let strategyList = new Map<string, number>();
    const totalAmount = vaults.reduce((prev, current) => prev + parseFloat(current.amount), 0);

    for (let i = 0; i < vaults.length; i++) {
        const vault = vaults[i];
        // store stablecoin reserves per vault
        switch (vault.name) {
            case 'DAI':
                reserveDai = parseFloat(vault.reserves.amount);
                break;
            case 'USDC':
                reserveUsdc = parseFloat(vault.reserves.amount);
                break;
            case 'USDT':
                reserveUsdt = parseFloat(vault.reserves.amount);
                break;
            default:
                // todo: warning
                break;
        }
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

    // calc stablecoin exposure
    for (let z = 0; z < vaults.length; z++) {
        const vault = vaults[z];
        let amount = 0;
        switch (vault.name) {
            case 'DAI':
                amount = (totalAmount - reserveUsdc - reserveUsdt) / totalAmount;
                break;
            case 'USDC':
                amount = (totalAmount - reserveDai - reserveUsdt) / totalAmount;
                break;
            case 'USDT':
                amount = (totalAmount - reserveDai - reserveUsdc) / totalAmount;
                break;
            default:
                // todo: warning
                break;
        }
        stablecoins.push({
            "concentration": toStr(amount),
            "display_name": vault.name,
            "name": vault.name,
        });
    }

    // calc metacoin exposure
    strategyList.forEach((value, key) => {
        stablecoins.push({
            "concentration": toStr(value / totalAmount),
            "display_name": key,
            "name": key,
        })
    })

    // calc protocol exposure
    protocolList.forEach((value, key) => {
        protocols.push({
            "concentration": toStr((value - reservesTotal) / totalAmount),
            "display_name": key.toUpperCase(),
            "name": key.toUpperCase(),
        });
        if (key === 'convex') {
            protocols.push({
                "concentration": toStr((value - reservesTotal) / totalAmount),
                "display_name": 'CURVE',
                "name": 'CURVE',
            });
        }
    });

    return {
        protocols: protocols,
        stablecoins: stablecoins,
    }
}
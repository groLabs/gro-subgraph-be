import { toStr } from '../utils/utils';
import { getPools } from '../utils/pools';
import { getCoreApy } from '../utils/apy';
import { getSystem } from '../utils/strategies';
import { getExposures } from '../utils/exposure';
import { IGroStatsEthereum } from '../interfaces/groStats/IGroStats';
import { EMPTY_EXPOSURE } from './groStatsEmpty';
import {
    Status,
    NetworkName,
} from '../types';
import {
    // PWRD_TVL_CORRECTION,
    LAUNCH_TIMESTAMP_ETH,
} from '../constants';


export const groStatsParserEthereum = (
    stats_eth: any,
    nowTS: number,
): IGroStatsEthereum => {
    // console.dir(stats_eth, { depth: null });
    const md = stats_eth.masterDatas[0];
    const price = stats_eth.prices[0];
    const core = stats_eth.coreDatas[0];
    const factor = stats_eth.factors[0];
    const strategies = stats_eth.gvaultStrategies;
    const currentTimestamp = stats_eth._meta.block.timestamp;
    const poolData = stats_eth.poolDatas;
    const stakerData = stats_eth.stakerDatas;
    const poolSwaps = stats_eth.poolSwaps;
    // pre-calcs
    const pwrdFactor = parseFloat(factor.pwrd);
    const pwrdTvl = (pwrdFactor > 0)
        ? (parseFloat(core.total_supply_pwrd_based) / pwrdFactor)
        : 0;
    const gvtTvl = parseFloat(core.total_supply_gvt) * parseFloat(price.gvt);
    const totalTvl = pwrdTvl + gvtTvl;
    const system = getSystem(strategies, totalTvl, price.threeCrv);
    const exposure = (system.vault)
        ? getExposures(system.vault)
        : EMPTY_EXPOSURE;
    const currentApy = getCoreApy(
        gvtTvl,
        pwrdTvl,
        parseFloat(system.last3d_apy),
    );
    const pools = getPools(
        poolData,
        stakerData,
        md,
        core,
        price,
        poolSwaps,
        nowTS,
        parseFloat(currentApy.pwrd),
        parseFloat(currentApy.gvt),
    );
    const result = {
        'status': md.status as Status,
        'current_timestamp': currentTimestamp.toString(),
        'launch_timestamp': LAUNCH_TIMESTAMP_ETH,
        'network': NetworkName.MAINNET,
        'apy': {
            'current': currentApy,
        },
        'tvl': {
            'pwrd': toStr(pwrdTvl),
            'gvt': toStr(gvtTvl),
            'total': toStr(totalTvl),
            'util_ratio': md.util_ratio,
            'util_ratio_limit': md.util_ratio_limit,
        },
        'system': system,
        'exposure': exposure,
        'token_price_usd': {
            'pwrd': toStr(price.pwrd),
            'gvt': toStr(price.gvt),
            'gro': toStr(price.gro),
            'dai': toStr(price.dai),
            'usdc': toStr(price.usdc),
            'usdt': toStr(price.usdt),
            'uniswap_gvt_gro': toStr(price.uniswap_gvt_gro),
            'uniswap_gro_usdc': toStr(price.uniswap_gro_usdc),
            'balancer_gro_weth': toStr(price.balancer_gro_weth),
            'curve_pwrd3crv': toStr(price.curve_pwrd3crv),
        },
        'pools': pools,
    }
    return result;
}

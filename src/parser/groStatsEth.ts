import { toStr } from '../utils/utils';
import { getCoreApy } from '../utils/apy';
import { getSystem } from '../utils/strategies';
import { getExposures } from '../utils/exposure';
import { LAUNCH_TIMESTAMP_ETH } from '../constants';
import { IGroStatsEthereum } from '../interfaces/groStats/IGroStats';
import { EMPTY_EXPOSURE } from './groStatsEmpty';
import {
    Status,
    NetworkName,
} from '../types';


export const groStatsParserEthereum = (
    stats_eth: any
): IGroStatsEthereum => {
    let value = toStr(0);
    const md = stats_eth.masterDatas[0];
    const price = stats_eth.prices[0];
    const core = stats_eth.coreDatas[0];
    const factor = stats_eth.factors[0];
    const strategies = stats_eth.strategies;
    const currentTimestamp = stats_eth._meta.block.timestamp;
    // pre-calcs
    const pwrdTvl = parseFloat(core.total_supply_pwrd_based) / parseFloat(factor.pwrd);
    const gvtTvl = parseFloat(core.total_supply_gvt) * parseFloat(price.gvt);
    const totalTvl = pwrdTvl + gvtTvl;
    const system = getSystem(strategies);
    const exposure = (system.vault)
        ? getExposures(system.vault)
        : EMPTY_EXPOSURE;
    const currentApy = getCoreApy(
        gvtTvl,
        pwrdTvl,
        parseFloat(system.last3d_apy)
    );

    const result = {
        'status': md.status as Status,
        'current_timestamp': currentTimestamp.toString(),
        'launch_timestamp': LAUNCH_TIMESTAMP_ETH,
        'network': NetworkName.MAINNET,
        'apy': {
            'last24h': {
                'pwrd': value,
                'gvt': value,
            },
            'last7d': {
                'pwrd': value,
                'gvt': value,
            },
            'daily': {
                'pwrd': value,
                'gvt': value,
            },
            'weekly': {
                'pwrd': value,
                'gvt': value,
            },
            'monthly': {
                'pwrd': value,
                'gvt': value,
            },
            'all_time': {
                'pwrd': value,
                'gvt': value,
            },
            'current': currentApy,
            'hodl_bonus': value,
        },
        'tvl': {
            "pwrd": toStr(pwrdTvl),
            "gvt": toStr(gvtTvl),
            "total": toStr(totalTvl),
            "util_ratio": value,
            "util_ratio_limit_PD": value,
            "util_ratio_limit_GW": value,
        },
        'system': system,
        'exposure': exposure,
        'token_price_usd': {
            "pwrd": toStr(price.pwrd),
            "gvt": toStr(price.gvt),
            "gro": toStr(price.gro),
        },
        'pools': [],
        'pwrdBoost': {
            "upperBoostApy": value,
            "lowerBoostApy": value,
        },
        'gvtBoost': {
            "upperBoostApy": value,
            "lowerBoostApy": value,
        },
    }
    return result;
}

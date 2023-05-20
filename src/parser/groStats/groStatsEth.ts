import { getPools } from '../../utils/pools';
import { blockData } from '../../caller/blockCaller';
import { EMPTY_EXPOSURE } from './groStatsEmpty';
import { getSystem } from '../../utils/strategies';
import { getExposures } from '../../utils/exposure';
import { IGroStatsEthereum } from '../../interfaces/groStats/IGroStats';
import {
    now,
    toStr,
} from '../../utils/utils';
import {
    getCoreApy,
    getCoreApyPps,
    checksumGvtApy,
} from '../../utils/apy';
import {
    Status,
    NetworkName,
} from '../../types';
import {
    // PWRD_TVL_CORRECTION,
    LAUNCH_TIMESTAMP_ETH,
} from '../../constants';


/// @notice Parses raw Ethereum Gro protocol statistics and returns a formatted IGroStatsEthereum object
/// @param stats_eth Raw Ethereum Gro protocol statistics data
/// @param nowTS Current timestamp
/// @return A formatted IGroStatsEthereum object containing parsed data
export const groStatsParserEthereum = (
    stats_eth: any,
    nowTS: number,
): IGroStatsEthereum => {
    // console.dir(stats_eth, { depth: null });
    const md = stats_eth.masterDatas[0];
    const price = stats_eth.prices[0];
    const priceAgo = stats_eth.prices_ago[0];
    const core = stats_eth.coreDatas[0];
    const factor = stats_eth.factors[0];
    const gvaults = stats_eth.gvaults;
    const currentTimestamp = now();
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
    const system = getSystem(
        gvaults,
        totalTvl,
        price.three_crv,
    );
    const exposure = (system.vault)
        ? getExposures(system.vault)
        : EMPTY_EXPOSURE;
    // const currentApy = getCoreApy(
    //     gvtTvl,
    //     pwrdTvl,
    //     parseFloat(system.last3d_apy),
    // );
    const currentApy = getCoreApyPps(
        parseFloat(price.gvt),
        (priceAgo.gvt_ago === 'NA') ? -1 : parseFloat(priceAgo.gvt_ago),
    );
    const checkGvtApy = checksumGvtApy(
        price.gvt,
        priceAgo.gvt_ago,
        blockData,
    );
    const pools = getPools(
        poolData,
        stakerData,
        md,
        core,
        price,
        poolSwaps,
        nowTS,
        parseFloat(currentApy.current.pwrd),
        (currentApy.current.gvt === 'NA') ? 0 : parseFloat(currentApy.current.gvt),
    );
    const result: IGroStatsEthereum = {
        'status': md.status as Status,
        'current_timestamp': currentTimestamp.toString(),
        'launch_timestamp': LAUNCH_TIMESTAMP_ETH,
        'network': NetworkName.MAINNET,
        'apy': currentApy,
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
            'uniswap_gvt_gro': toStr(price.uniswap_gvt_gro),
            'uniswap_gro_usdc': toStr(price.uniswap_gro_usdc),
            'balancer_gro_weth': toStr(price.balancer_gro_weth),
            'curve_pwrd3crv': toStr(price.curve_pwrd3crv),
        },
        'pools': pools,
        'checksum': {
            'gvt_apy': [checkGvtApy],
        }
    }
    return result;
}

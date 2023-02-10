import { toStr } from '../utils/utils';
import { LAUNCH_TIMESTAMP_AVAX } from '../constants';
import { IGroStatsAvalanche } from '../interfaces/groStats/IGroStats';
import {
    Status,
    NetworkName,
} from '../types';
import {
    getTvl,
    getLabs,
} from '../utils/labs';


export const groStatsParserAvalanche = (
    stats_avax: any
): IGroStatsAvalanche => {
    const md = stats_avax.masterDatas[0];
    const strategies = stats_avax.strategies;
    // pre-calcs
    const tvl = getTvl(strategies);
    const labs = getLabs(
        strategies,
        parseFloat(tvl.total),
    );

    const result = {
        'status': md.status as Status,
        'network': NetworkName.MAINNET,
        'launch_timestamp': LAUNCH_TIMESTAMP_AVAX,
        'tvl': tvl,
        'token_price_usd': {
            'avax': toStr(0), // todo
        },
        'labs_vault': labs,
    }
    return result;
}

import { 
    getTvl,
    getLabs,
} from '../utils/labs';
import { LAUNCH_TIMESTAMP_AVAX } from '../constants';
import { IGroStatsAvalanche } from '../interfaces/groStats/IGroStats';
import {
    Status,
    NetworkName,
} from '../types';


export const groStatsParserAvalanche = (
    stats_avax: any
): IGroStatsAvalanche => {
    let value = '0'; //TODO: temp
    const md = stats_avax.masterDatas[0];
    const strategies = stats_avax.strategies;

    const result = {
        'status': md.status as Status,
        'network': NetworkName.MAINNET,
        'launch_timestamp': LAUNCH_TIMESTAMP_AVAX,
        'tvl': getTvl(strategies),
        'token_price_usd': {
            'avax': value,
        },
        'labs_vault': getLabs(strategies),
    }
    return result;
}

import {
    Status,
    NetworkName,
} from '../types';
import {
    emptyGroStatsEth,
    emptyGroStatsAvax,
} from './groStatsEmpty';
import { IGroStats } from '../interfaces/groStats/IGroStats';


export const groStatsError = (
    currentTimestamp: string,
    error_msg: string,
): IGroStats => {
    const result = {
        "status": Status.ERROR,
        "error_msg": error_msg,
        'current_timestamp': currentTimestamp,
        'network': NetworkName.MAINNET,
        'mc_totals': {
            'tvl': {
                'mainnet': 'N/A',
                'avalanche': 'N/A',
                'total': 'N/A',
            }
        },
        'mainnet': emptyGroStatsEth(
            currentTimestamp,
            Status.ERROR
        ),
        'avalanche': emptyGroStatsAvax(
            Status.ERROR
        ),
    }
    return result;
}
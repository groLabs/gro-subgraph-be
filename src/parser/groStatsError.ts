import { NA } from '../constants';
import { IGroStats } from '../interfaces/groStats/IGroStats';
import {
    Status,
    NetworkName,
} from '../types';
import {
    emptyGroStatsEth,
    emptyGroStatsAvax,
} from './groStatsEmpty';


/// @notice Creates an error IGroStats object with a given error message
/// @param currentTimestamp The current timestamp
/// @param error_msg The error message to include in the result
/// @return An IGroStats object with the error status and provided error message
export const groStatsError = (
    currentTimestamp: string,
    error_msg: string,
): IGroStats => {
    const result = {
        'gro_stats_mc': {
            'status': Status.ERROR,
            'error_msg': error_msg,
            'current_timestamp': currentTimestamp,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'tvl': {
                    'mainnet': NA,
                    'avalanche': NA,
                    'total': NA,
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
    }
    return result;
}

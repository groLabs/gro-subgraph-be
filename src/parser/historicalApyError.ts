import { Status } from '../types';
import { LAUNCH_TIMESTAMP_ETH } from '../constants';
import { IHistoricalApy } from '../interfaces/historicalApy/historicalApy';


export const historicalApyError = (
    currentTimestamp: string,
    error_msg: string,
): IHistoricalApy => {
    return {
        'historical_stats': {
            'status': Status.ERROR,
            'error_msg': error_msg,
            'current_timestamp': currentTimestamp,
            'launch_timestamp': LAUNCH_TIMESTAMP_ETH,
            'network': '1',
            'response1': [],
            'response2': [],
            'response3': [],
        }
    }
}

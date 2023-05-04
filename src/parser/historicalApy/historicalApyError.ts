import { Status } from '../../types';
import { LAUNCH_TIMESTAMP_ETH } from '../../constants';
import { IHistoricalApy } from '../../interfaces/historicalApy/historicalApy';


/// @notice Creates an error response for historical APY data
/// @dev Used to return an error response when data is not available or when there is an error
/// @param currentTimestamp The current timestamp as a string
/// @param error_msg The error message to include in the response
/// @return An IHistoricalApy object containing the error information
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

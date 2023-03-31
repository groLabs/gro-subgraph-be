import moment from 'moment';
import { now } from '../utils/utils';
import { LAUNCH_TIMESTAMP_ETH } from '../constants';
import { historicalApyError } from '../parser/historicalApyError';
import {
    showInfo,
    showError,
} from './logHandler';
import { 
    IResponses,
    IHistoricalApy,
} from '../interfaces/historicalApy/historicalApy';
import {
    Status,
    NetworkId
} from '../types';
import {
    checkData,
    parseData
} from '../parser/historicalApy';


/* parameters example:
    attr=apy_current,apy_current,apy_current
    freq=twice_daily,daily,weekly
    start=1669913771,1669913771,1669913771
    end=1672505771,1672505771,1672505771
*/

/// @notice Fetches historical APY data based on provided attributes, frequency, start and end dates
/// @dev Validates input data, retrieves and parses historical data, and returns the results in a formatted structure
/// @param _attr An array of attributes to fetch historical data for
/// @param _freq An array of frequencies corresponding to the attributes to fetch historical data for
/// @param _start An array of start dates corresponding to the attributes to fetch historical data for
/// @param _end An array of end dates corresponding to the attributes to fetch historical data for
/// @return An IHistoricalApy object containing historical APY data or an error message
export const getHistoricalApy = async (
    _attr: any,
    _freq: any,
    _start: any,
    _end: any,
) : Promise<IHistoricalApy> => {
    try {
        const res = checkData(_attr, _freq, _start, _end);
        if (res.status === Status.ERROR)
            return historicalApyError(
                now(),
                res.msg,
            );
        const [attr, freq, start, end] = res.data;
        const results = await Promise.all(
            attr.map((_: any, i: number) => parseData(attr[i], freq[i], start[i], end[i]))
        );
        let parsedResults = [];
        for (let i = 0; i < results.length; i++) {
            parsedResults.push({
                'key': `response${i + 1}`,
                'value': {
                    'attribute': attr[i],
                    'frequency': freq[i],
                    'start': start[i],
                    'end': end[i],
                    'results': results[i]
                }
            })
        }
        const object = parsedResults.reduce(
            (obj, item) => Object.assign(obj, { [item.key]: item.value }), {});
        const result = {
            'historical_stats': {
                'status': Status.OK,
                'error_msg': '',
                'current_timestamp': moment().unix().toString(),
                'launch_timestamp': LAUNCH_TIMESTAMP_ETH.toString(),
                'network': NetworkId.MAINNET,
                ...object as IResponses,
            }
        }
        showInfo(`Historical APY requested`);
        return result;
    } catch (err) {
        showError('handler/historicalApyHandler.ts->getHistoricalAPY()', err);
        return historicalApyError(
            now(),
            err as string,
        );
    }
}

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
    network=ropsten
    attr=apy_last7d,apy_last7d,apy_last7d
    freq=twice_daily,daily,7day
    start=1625057600,1625092600,1625097000
    end=1629936000,1629936000,1629936000
*/
export const getHistoricalApy = async (
    _attr: any,
    _freq: any,
    _start: any,
    _end: any,
) : Promise<IHistoricalApy> => {
    try {
        const res = checkData(_attr, _freq, _start, _end);
        if (res.status === 'KO')
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

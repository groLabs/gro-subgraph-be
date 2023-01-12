import moment from 'moment';
import { QUERY_ERROR } from '../constants';
import { query } from '../handler/queryHandler';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


export const loadHistoricalApy = async (
    apyGvt: number,
    apyPwrd: number,
): Promise<any> => {
    const params = parseApy(
        111111111,
        1,
        0.3
    );
    console.log(params);
    const result = await query('insert_protocol_apy.sql', params);
    if (result.status !== QUERY_ERROR) {
        showInfo(`yuujuuu`);
    } else {
        showError(
            'loader/historicalApyLoader.ts->loadHistoricalApy()',
            `Error while insterting historical APY into DB`
        );
    }
}

// todo: probably move this to /parser
const parseApy = (
    currentTs: number,
    tokenId : number,
    apyCurrent: number,
) => {
    const result = [
        currentTs,
        moment.unix(currentTs).utc(),
        1,          // networkId
        tokenId,
        null,       // last24h
        null,       // last7d
        null,       // daily
        null,       // weekly
        null,       // monthly
        null,       // all_time
        apyCurrent, // current
        moment().utc(),
    ];
    return result;
}

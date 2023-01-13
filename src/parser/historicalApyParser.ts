import moment from 'moment';
import { NetworkId } from '../types';


export const parseHistoricalApy = (
    currentTs: number,
    tokenId: number,
    apyCurrent: number,
) => {
    const result = [
        currentTs,
        moment.unix(currentTs).utc(),
        NetworkId.MAINNET,
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

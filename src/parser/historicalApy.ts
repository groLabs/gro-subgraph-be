import moment from 'moment';
import { NetworkId } from '../types';
import { QUERY_ERROR } from '../constants';
import { query } from '../handler/queryHandler';
import { showError } from '../handler/logHandler';


const isArray = (
    attr: string,
    freq: string,
    start: string,
    end: string,
): boolean => {
    if (
        attr.includes(',') &&
        freq.includes(',') &&
        start.includes(',') &&
        end.includes(',')
    ) return true;
    return false;
}

const isAttr = (_attr: any): boolean => {
    for (const attr of _attr) {
        if (
            attr !== 'apy_last24h' &&
            attr !== 'apy_last7d' &&
            attr !== 'apy_daily' &&
            attr !== 'apy_weekly' &&
            attr !== 'apy_monthly' &&
            attr !== 'apy_all_time' &&
            attr !== 'apy_current'
        ) return false;
    }
    return true;
}

const isFreq = (_freq: any): boolean => {
    for (const freq of _freq) {
        if (
            freq !== 'twice_daily' &&
            freq !== 'daily' &&
            freq !== 'weekly'
        ) return false;
    }
    return true;
}

const isTimestamp = (_ts: any): boolean => {
    const regexp = /^\d{10}$/;
    for (const ts of _ts) {
        if (!regexp.test(ts)) {
            return false;
        }
    }
    return true;
}

const isLength = (
    attr: string,
    freq: string,
    start: string,
    end: string,
): boolean => {
    if (
        attr.length !== freq.length ||
        attr.length !== start.length ||
        attr.length !== end.length
    ) return false;
    return true;
}

const ERROR_ATTR = {
    status: 'KO',
    msg: `Unrecognised attribute: should be 'apy_last24h', 'apy_last7d', 'apy_daily', 'apy_weekly', 'apy_monthly', 'apy_all_time' or 'apy_current'`,
    data: [],
}

const ERROR_FREQ = {
    status: 'KO',
    msg: `Unrecognised frequency: should be 'twice_daily', 'daily' or 'weekly'`,
    data: [],
}

const ERROR_TIMESTAMP = {
    status: 'KO',
    msg: `Unrecognised date: start & end dates must be a unix timestamp`,
    data: [],
}

const ERROR_LENGTH = {
    status: 'KO',
    msg: `Wrong length: all parameters must have the same length of values`,
    data: [],
}

const ERROR_VALUES = {
    status: 'KO',
    msg: `Wrong values: inconsistent values within the parameters`,
    data: [],
}

export const parseHistoricalApyQuery = (
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

export const parseData = async (
    kpi: string,
    frequency: string,
    startDate: number,
    endDate: number,
) => {
    try {
        let q;
        const fromDate = moment.unix(startDate).format('MM/DD/YYYY');
        const toDate = moment.unix(endDate).format('MM/DD/YYYY');
        switch (frequency) {
            case 'twice_daily':
                q = 'select_fe_historical_apy_twice_daily.sql';
                break;
            case 'daily':
                q = 'select_fe_historical_apy_daily.sql';
                break;
            case 'weekly':
                q = 'select_fe_historical_apy_weekly.sql';
                break;
            default:
                return {};
        }
        const res = await query(q, [fromDate, toDate]);
        if (res.status !== QUERY_ERROR) {
            const apy = res.rows;
            let result = [];
            let gvt;
            let pwrd;
            for (let i = 0; i < apy.length; i++) {
                if (i > 0) {
                    if (apy[i].current_timestamp === apy[i - 1].current_timestamp) {
                        pwrd =
                            (apy[i].product_id === 1)
                                ? apy[i][kpi]
                                : apy[i - 1][kpi];
                        gvt =
                            (apy[i].product_id === 2)
                                ? apy[i][kpi]
                                : apy[i - 1][kpi];
                        result.push({
                            "gvt": parseFloat(gvt),
                            "date": apy[i].current_timestamp,
                            "pwrd": parseFloat(pwrd),
                        });
                    }
                }
            }
            return result;
        } else {
            return {}
        }
    } catch (err) {
        showError('handler/historicalAPY.ts->parseData()', err);
    }
}

export const checkData = (
    attr: any,
    freq: any,
    start: any,
    end: any,
) => {
    try {
        // Array of values
        if (isArray(attr, freq, start, end)) {
            if (
                typeof attr === 'string' &&
                typeof freq === 'string' &&
                typeof start === 'string' &&
                typeof end === 'string'
            ) {
                attr = attr.split(',');
                freq = freq.split(',');
                start = start.split(',');
                end = end.split(',');

                if (!isAttr(attr)) {
                    return ERROR_ATTR;
                } else if (!isFreq(freq)) {
                    return ERROR_FREQ;
                } else if (!isTimestamp(start) || !isTimestamp(end)) {
                    return ERROR_TIMESTAMP;
                } else if (!isLength(attr, freq, start, end)) {
                    return ERROR_LENGTH;
                } else {
                    return {
                        status: 'OK',
                        msg: 'OK',
                        data: [attr, freq, start, end],
                    }
                }
            } else {
                return ERROR_VALUES;
            }
            // No array of values
        } else {
            if (!isAttr([attr])) {
                return ERROR_ATTR;
            } else if (!isFreq([freq])) {
                return ERROR_FREQ;
            } else if (!isTimestamp([start]) || !isTimestamp([end])) {
                return ERROR_TIMESTAMP;
            } else {
                return {
                    status: 'OK',
                    msg: 'OK',
                    data: [[attr], [freq], [start], [end]],
                }
            }
        }
    } catch (err) {
        showError('historicalAPY.ts->checkData()', err);
        return {
            status: 'KO',
            msg: `Unrecognised error in historicalAPY.ts->checkData():${err}`,
            data: [],
        }
    }
}
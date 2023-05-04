import moment from 'moment';
import { QUERY_ERROR } from '../../constants';
import { query } from '../../handler/queryHandler';
import { showError } from '../../handler/logHandler';
import {
    Status,
    NetworkId,
} from '../../types';
import {
    IApy,
    IHistoricalApyCheck,
} from '../../interfaces/historicalApy/historicalApy';


/// @notice Determines if the provided parameters are comma-separated lists of values
/// @return True if all parameters are comma-separated lists, otherwise false
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

/// @notice Validates if the provided attributes are acceptable
/// @param _attr An array of attribute values
/// @return True if all attribute values are valid, otherwise false
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

/// @notice Validates if the provided frequencies are acceptable
/// @param _freq An array of frequency values
/// @return True if all frequency values are valid, otherwise false
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

/// @notice Validates if the provided timestamps are valid Unix timestamps
/// @param _ts An array of timestamp values
/// @return True if all timestamp values are valid Unix timestamps, otherwise false
const isTimestamp = (_ts: any): boolean => {
    const regexp = /^\d{10}$/;
    for (const ts of _ts) {
        if (!regexp.test(ts)) {
            return false;
        }
    }
    return true;
}

/// @notice Validates if the provided parameters have the same length of values
/// @return True if all parameters have the same length of values, otherwise false
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

const ERROR_ATTR: IHistoricalApyCheck = {
    status: Status.ERROR,
    msg: `Unrecognised attribute: should be 'apy_last24h', 'apy_last7d', 'apy_daily', 'apy_weekly', 'apy_monthly', 'apy_all_time' or 'apy_current'`,
    data: [],
}

const ERROR_FREQ: IHistoricalApyCheck = {
    status: Status.ERROR,
    msg: `Unrecognised frequency: should be 'twice_daily', 'daily' or 'weekly'`,
    data: [],
}

const ERROR_TIMESTAMP: IHistoricalApyCheck = {
    status: Status.ERROR,
    msg: `Unrecognised date: start & end dates must be a unix timestamp`,
    data: [],
}

const ERROR_LENGTH: IHistoricalApyCheck = {
    status: Status.ERROR,
    msg: `Wrong length: all parameters must have the same length of values`,
    data: [],
}

const ERROR_VALUES: IHistoricalApyCheck = {
    status: Status.ERROR,
    msg: `Wrong values: inconsistent values within the parameters`,
    data: [],
}

/// @notice Parses historical APY query results into a formatted array
/// @dev only apyCurrent is used, the rest of time transformations are disabled
/// @param currentTs The current timestamp
/// @param tokenId The token ID
/// @param apyCurrent The current APY
/// @return A formatted array containing parsed historical APY data
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

/// @notice Fetches and formats historical APY data from the database
/// @param kpi The KPI attribute to query
/// @param frequency The frequency of the historical data
/// @param startDate The start date of the historical data range
/// @param endDate The end date of the historical data range
/// @return A promise that resolves to an array of IApy objects containing the historical APY data.
export const parseData = async (
    kpi: string,
    frequency: string,
    startDate: number,
    endDate: number,
): Promise<IApy[]> => {
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
                return [];
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
            return [];
        }
    } catch (err) {
        showError('handler/historicalAPY.ts->parseData()', err);
        return [];
    }
}

/// @notice Validates the provided parameters for querying historical APY data
/// @return An object with the validation status, message, and data (if validation is successful)
export const checkData = (
    attr: any,
    freq: any,
    start: any,
    end: any,
): IHistoricalApyCheck => {
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
                        status: Status.OK,
                        msg: Status.OK,
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
                    status: Status.OK,
                    msg: Status.OK,
                    data: [[attr], [freq], [start], [end]],
                }
            }
        }
    } catch (err) {
        showError('historicalAPY.ts->checkData()', err);
        return {
            status: Status.ERROR,
            msg: `Unrecognised error in historicalAPY.ts->checkData():${err}`,
            data: [],
        }
    }
}

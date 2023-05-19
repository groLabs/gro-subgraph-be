import { Status } from '../../../types';

export interface IGvtApy {
    readonly 'gvt_price': string | null,
    readonly 'gvt_price_ndays_ago': string | null,
    readonly 'days': number,
    readonly 'latestBlockNumber': number | null,
    readonly 'blockNumberNDaysAgo': number | null,
    readonly 'lastExecutionTimestamp': moment.Moment | null,
    readonly 'status': Status,
}

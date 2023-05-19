import { Status } from '../../types';

export interface IBlockNumbers {
    lastExecutionTimestamp: moment.Moment | null;
    latestBlockNumber: number | null;
    blockNumberNDaysAgo: number | null;
    dummyBlockNumber: number;
    status: Status;
}

import { TX_ITERATION } from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


export const getPersonalStats = async (
    url: string,
    account: string,
    skip: number,
    result: any
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            account,
            TX_ITERATION,
            skip,
            Route.PERSONAL_STATS,
        );
        if (call.errors) {
            return call;
        } else if (call.data.users.length === 0) {
            return call.data;
        } else {
            if (skip === 0) {
                result = call.data;
            } else {
                const transfers = result.users[0].transfers.concat(call.data.users[0].transfers);
                result.users[0].transfers = transfers;
            }
            return (call.data.users[0].transfers.length < TX_ITERATION)
                ? result
                : getPersonalStats(
                    url,
                    account,
                    skip + TX_ITERATION,
                    result
                );
        }
    } catch (err) {
        showError('handler/personalStatsHandler.ts->getPersonalStats()', err);
        return null;
    }
}
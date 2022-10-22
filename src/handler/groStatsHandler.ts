import { TX_ITERATION } from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


//TODO: review where to apply recursivity (probably in Vault/Strategies)
export const getGroStats = async (
    url: string,
    skip: number,
    result: any
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            '',
            TX_ITERATION,
            skip,
            Route.GRO_STATS,
        );
        if (call.errors) {
            return call;
        } else {
            if (skip === 0) {
                result = call.data;
            } else {
                // todo
                // const transfers = result.users[0].transfers.concat(call.data.users[0].transfers);
                // result.users[0].transfers = transfers;
            }
            return (/*call.data.users[0].transfers.length < TX_ITERATION*/ 1 === 1)
                ? result
                : getGroStats(
                    url,
                    skip + TX_ITERATION,
                    result
                );
        }
    } catch (err) {
        showError('handler/groStatsHandler.ts->getGroStats()', err);
        return null;
    }
}
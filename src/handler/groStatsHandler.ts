import { TX_ITERATION } from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


export const getGroStats = async (
    url: string,
    skip: number,
    result: any,
    tsNow: number,
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            '',
            TX_ITERATION,
            skip,
            Route.GRO_STATS_MC,
            tsNow
        );
        if (!call) {
            return null;
        } else if (call.errors) {
            return call;
        } else {
            return call.data;
        }
    } catch (err) {
        showError('handler/groStatsHandler.ts->getGroStats()', err);
        return null;
    }
}

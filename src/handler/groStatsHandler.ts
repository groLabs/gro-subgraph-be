import { TX_ITERATION } from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


export const getGroStats = async (
    url: string,
    skip: number,
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
        if (call.errors) {
            return call;
        } if (call.data) {
            return call.data;
        } else {
            return null;
        }
    } catch (err) {
        showError('handler/groStatsHandler.ts->getGroStats()', err);
        return null;
    }
}

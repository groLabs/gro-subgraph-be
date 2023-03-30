import { TX_ITERATION } from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';


/// @notice Fetches Gro protocol statistics from the specified subgraph URL
/// @dev Calls a subgraph with the provided URL and timestamp, handles any errors, and returns the fetched data
/// @param url The subgraph URL to fetch Gro protocol statistics from
/// @param tsNow The current timestamp to pass to the callSubgraph function
/// @return The Gro protocol statistics data fetched from the subgraph or null if an error occurs or no data is found
// todo: fine-tune the response (avoid nulls)
export const getGroStats = async (
    url: string,
    tsNow: number,
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            '',
            TX_ITERATION,
            0,
            Route.GRO_STATS_MC,
            tsNow,
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

import { getUrl } from '../utils/utils';
import { TX_ITERATION } from '../constants';
import { botStatusParser } from '../parser/botStatus/botStatus';
import { callSubgraph } from '../caller/subgraphCaller';
import { botStatusError } from '../parser/botStatus/botStatusError';
import {
    Route,
    Subgraph
} from '../types';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


// @notice Sends a request to the subgraph and returns the response
// @param url The URL of the subgraph to call
// @param route The route to be called in the subgraph (i.e.: Route.BOT_STATUS)
// @returns The subgraph response
const caller = async (
    url: string,
    route: Route,
): Promise<any> => {
    const call = await callSubgraph(
        url,
        '',
        TX_ITERATION,
        0,
        route,
        0,
    );
    return call;
}

// @notice Handles the request for bot status by retrieving subgraph core data for 
//         Ethereum and Avalanche
// @param subgraph The subgraph target to retrieve the data from
// @returns The parsed bot status
export const botStatusHandler = async (
    subgraph: Subgraph,
): Promise<any> => {
    try {
        showInfo(`Bot status requested`);
        const url = getUrl(subgraph);
        const [resultEth, resultAvax] = await Promise.all([
            caller(url.ETH, Route.BOT_STATUS),
            caller(url.AVAX, Route.BOT_STATUS),
        ]);
        return botStatusParser(resultEth, resultAvax);
    } catch (err) {
        showError('handler/botStatsHandler.ts->botStatusHandler()', err);
        return botStatusError(err as string);
    }
}

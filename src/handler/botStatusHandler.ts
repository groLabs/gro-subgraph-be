import { getUrl } from '../utils/utils';
import { TX_ITERATION } from '../constants';
import { botStatusParser } from '../parser/botStatus';
import { botStatusError } from '../parser/botStatusError';
import { callSubgraph } from '../caller/subgraphCaller';
import {
    Route,
    Subgraph
} from '../types';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


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
        return botStatusParser(resultEth, resultAvax)
    } catch (err) {
        showError('handler/botStatsHandler.ts->botStatusHandler()', err);
        return botStatusError(err as string);
    }
}

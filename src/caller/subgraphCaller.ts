import axios from 'axios';
import { Route } from '../types';
import { TS_15D } from '../constants';
import { IError } from '../interfaces/url/IError';
import { showError } from '../handler/logHandler';
import { queryGroStatsEth } from '../graphql/groStatsEth';
import { queryGroStatsAvax } from '../graphql/groStatsAvax';
import { queryPersonalStatsEth } from '../graphql/personalStatsEth';
import { queryPersonalStatsAvax } from '../graphql/personalStatsAvax';
import {
    isEthSubgraph,
    isAvaxSubgraph
} from '../utils/utils';


const getQuery = (
    url: string,
    account: string,
    first: number,
    skip: number,
    route: Route,
    tsNow: number
): string | null => {
    if (isEthSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return queryPersonalStatsEth(account, first, skip);
        } else if (route === Route.GRO_STATS_MC) {
            return queryGroStatsEth(first, skip, tsNow, tsNow - TS_15D);
        }
    } else if (isAvaxSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return queryPersonalStatsAvax(account, first, skip);
        } else if (route === Route.GRO_STATS_MC) {
            return queryGroStatsAvax(first, skip, tsNow, tsNow - TS_15D);
        }
    }
    showError('caller/subgraphCaller.ts->getQuery()', `Unknown route ${route} or subgraph api ${url}`);
    return null;
};

export const callSubgraph = async (
    url: string,
    account: string,
    first: number,
    skip: number,
    route: Route,
    tsNow: number,
): Promise<any> => {
    const query = getQuery(url, account, first, skip, route, tsNow);
    if (!query) {
        return null;
    }
    const path = 'caller/subgraphCaller.ts->callSubgraph()'
    const result = await axios.post(
        url,
        { query: query }
    ).then(res => {
        if (res.data.errors) {
            showError(
                `${path} [Error from Subgraph]`,
                JSON.stringify(res.data.errors, null, 1),
            );
        }
        return res.data;
    }).catch(err => {
        let errorMsg = '';
        if (err.response) {
            // Request made and server responded
            errorMsg = `<${err.response.status} ${err.response.statusText}> on url ${err.response.config.url}`;
            showError(`${path} [Error from Axios]`, errorMsg);
        } else if (err.request) {
            // The request was made but no response was received
            errorMsg = `Request without response ${err.message}`;
            showError(`${path} [Error from Axios]`, errorMsg);
        } else {
            // Something happened in setting up the request that triggered an Error
            errorMsg = `Error on setting up the request: ${err.message}`;
            showError(`${path} [Error from Axios]`, errorMsg);
        }
        const errorResponse: IError = {
            errors: [errorMsg],
        }
        return errorResponse;
    });
    return result;
}

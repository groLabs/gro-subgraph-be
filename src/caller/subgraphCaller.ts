import axios from 'axios';
import { TS_15D } from '../constants';
import { queryStatus } from '../graphql/status';
import { IError } from '../interfaces/url/IError';
import { showError } from '../handler/logHandler';
import { IQuery } from '../interfaces/status/IQuery';
import { queryGroStatsEth } from '../graphql/groStatsEth';
import { queryGroStatsAvax } from '../graphql/groStatsAvax';
import { queryPersonalStatsEth } from '../graphql/personalStatsEth';
import { queryPersonalStatsAvax } from '../graphql/personalStatsAvax';
import { 
    Route,
    Status,
} from '../types';
import {
    isEthSubgraph,
    isAvaxSubgraph
} from '../utils/utils';


/// @notice Wraps a given query string with a status
/// @param query The query string to wrap
/// @param status The status of the query (OK or ERROR)
/// @return An IQuery object containing the status and query data
const wrapQuery = (query: string, status: Status): IQuery => {
    return {
        status: status,
        data: query,
    }
}

/// @notice Generates a query based on the provided parameters and route
/// @param url The subgraph URL
/// @param account The user account address
/// @param first The number of records to fetch
/// @param blockTS The block timestamp to start fetching records from (starts with 0)
/// @param route The route for which the query should be generated
/// @param tsNow The current timestamp
/// @return An IQuery object containing the status and generated query data
const getQuery = (
    url: string,
    account: string,
    first: number,
    blockTS: number,
    route: Route,
    tsNow: number
): IQuery => {
    if (route === Route.STATUS) {
        const DEPLOYMENT_ID_ETH = process.env.DEPLOYMENT_ID_ETH;
        const DEPLOYMENT_ID_AVAX = process.env.DEPLOYMENT_ID_AVAX;
        if (!DEPLOYMENT_ID_ETH || !DEPLOYMENT_ID_AVAX) {
            const err = 'env variables <DEPLOYMENT_ID_ETH> | <DEPLOYMENT_ID_AVAX> missing'
            showError('caller/subgraphCaller.ts->getQuery()', err);
            return wrapQuery(err, Status.ERROR);
        } else {
            const deployments = `"${DEPLOYMENT_ID_ETH}", "${DEPLOYMENT_ID_AVAX}"`;
            return wrapQuery(queryStatus(deployments), Status.OK);
        }
    } else if (isEthSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return wrapQuery(queryPersonalStatsEth(account, first, blockTS), Status.OK);
        } else if (route === Route.GRO_STATS_MC) {
            return wrapQuery(queryGroStatsEth(tsNow, tsNow - TS_15D), Status.OK);
        }
    } else if (isAvaxSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return wrapQuery(queryPersonalStatsAvax(account, first, blockTS), Status.OK);
        } else if (route === Route.GRO_STATS_MC) {
            return wrapQuery(queryGroStatsAvax(), Status.OK);
        }
    }
    const err = `Unknown route ${route} or subgraph api ${url}`
    showError('caller/subgraphCaller.ts->getQuery()', err);
    return wrapQuery(err, Status.OK);
};

/// @notice Calls a subgraph with a specific query and returns the result
/// @param url The subgraph URL
/// @param account The user account address
/// @param first The number of records to fetch
/// @param blockTS The block timestamp to start fetching records from (starts with 0)
/// @param route The route for which the query should be generated
/// @param tsNow The current timestamp
/// @return The result of the subgraph call or an error object if any errors occurred
export const callSubgraph = async (
    url: string,
    account: string,
    first: number,
    blockTS: number,
    route: Route,
    tsNow: number,
): Promise<any> => {
    const query = getQuery(url, account, first, blockTS, route, tsNow);
    if (query.status === Status.ERROR) {
        return {
            errors: [query.data],
        };
    }
    const path = 'caller/subgraphCaller.ts->callSubgraph()';
    const result = await axios.post(
        url,
        { query: query.data }
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

import axios from 'axios';
import { IError } from '../interfaces/url/IError';
import { IBlockNumbers } from '../interfaces/blockNumbers/IBlockNumbers';
import { showError } from '../handler/logHandler';
import { queryBotStatus } from '../graphql/botStatus';
import { queryGroStatsEth } from '../graphql/groStatsEth';
import { queryGroStatsAvax } from '../graphql/groStatsAvax';
import { IQuery } from '../interfaces/subgraphStatus/IQuery';
import { queryGraphStatus } from '../graphql/subgraphStatus';
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
import {
    TS_15D,
    DAYS_GVT_APY,
} from '../constants';
import { 
    blockData,
    getBlockNumbers,
} from './blockCaller';


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
/// @param blocks The block number N days ago for the gvt apy calc (if groStats query)
/// @return An IQuery object containing the status and generated query data
const getQuery = (
    url: string,
    account: string,
    first: number,
    blockTS: number,
    route: Route,
    tsNow: number,
    blocks: IBlockNumbers,
): IQuery => {
    if (route === Route.SUBGRAPH_STATUS) {
        const DEPLOYMENT_ID_ETH = process.env.DEPLOYMENT_ID_ETH;
        const DEPLOYMENT_ID_AVAX = process.env.DEPLOYMENT_ID_AVAX;
        if (!DEPLOYMENT_ID_ETH || !DEPLOYMENT_ID_AVAX) {
            const err = 'env variables <DEPLOYMENT_ID_ETH> | <DEPLOYMENT_ID_AVAX> missing'
            showError('caller/subgraphCaller.ts->getQuery()', err);
            return wrapQuery(err, Status.ERROR);
        } else {
            const deployments = `"${DEPLOYMENT_ID_ETH}", "${DEPLOYMENT_ID_AVAX}"`;
            return wrapQuery(queryGraphStatus(deployments), Status.OK);
        }
    } else if (route === Route.BOT_STATUS) {
        return wrapQuery(queryBotStatus(), Status.OK);
    } else if (isEthSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return wrapQuery(queryPersonalStatsEth(account, first, blockTS), Status.OK);
        } else if (route === Route.GRO_STATS_MC) {
            // @TODO: replace this to show 'NA' in case the status == NOK
            const days = blocks.blockNumberNDaysAgo ? blocks.blockNumberNDaysAgo : blocks.dummyBlockNumber;
            return wrapQuery(queryGroStatsEth(tsNow, tsNow - TS_15D, days), Status.OK);
        }
    } else if (isAvaxSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            return wrapQuery(queryPersonalStatsAvax(account, first, blockTS), Status.OK);
        } else if (route === Route.GRO_STATS_MC) {
            return wrapQuery(queryGroStatsAvax(), Status.OK);
        }
    }
    const err = `Unknown route ${route} or subgraph api ${url}`;
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
    // Update blocks only if it's an ethereum groStats request
    const blocks = (route === Route.GRO_STATS_MC && isEthSubgraph(url))
        ? await getBlockNumbers(DAYS_GVT_APY)
        : blockData;
    const query = getQuery(url, account, first, blockTS, route, tsNow, blocks);
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

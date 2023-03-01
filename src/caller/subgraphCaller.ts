import axios from 'axios';
import { Route } from '../types';
import { TS_15D } from '../constants';
import { showError } from '../handler/logHandler';
import { queryGroStatsEth } from '../graphql/groStatsEth';
import { queryGroStatsAvax } from '../graphql/groStatsAvax';
import { queryPersonalStatsEth } from '../graphql/personalStatsEth';
import { queryPersonalStatsAvax } from '../graphql/personalStatsAvax';
import {
    isEthSubgraph,
    isAvaxSubgraph
} from '../utils/utils';


export const callSubgraph = async (
    url: string,
    account: string,
    first: number,
    skip: number,
    route: Route,
    tsNow: number,
): Promise<any> => {
    let q;
    if (isEthSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            q = queryPersonalStatsEth(
                account,
                first,
                skip
            );
        } else if (route === Route.GRO_STATS_MC) {
            q = queryGroStatsEth(
                first,
                skip,
                tsNow,
                tsNow - TS_15D,
            );
        } else {
            showError(
                'caller/subgraphCaller.ts->callSubgraph()',
                `unknown route ${route}}`,
            );
            return null;
        }
    } else if (isAvaxSubgraph(url)) {
        if (route === Route.GRO_PERSONAL_POSITION_MC) {
            q = queryPersonalStatsAvax(
                account,
                first,
                skip
            );
        } else if (route === Route.GRO_STATS_MC) {
            q = queryGroStatsAvax(
                first,
                skip,
                tsNow,
                tsNow - TS_15D,
            );
        } else {
            showError(
                'caller/subgraphCaller.ts->callSubgraph()',
                `unknown route ${route}}`,
            );
            return null;
        }
    } else {
        showError(
            'caller/subgraphCaller.ts->callSubgraph()',
            `Unknown subgraph api ${url}`,
        );
        return null;
    }
    const result = await axios.post(
        url,
        { query: q }
    );
    if (result.data.errors) {
        showError(
            'caller/subgraphCaller.ts->callSubgraph() [Error from Subgraph]',
            JSON.stringify(result.data.errors, null, 1),
        );
    }
    return result.data;

    // TODO: improve error handling in axios
    // axios.post(
    //     url,
    //     { query: q }
    // ).then(data => {
    //     // console.log(data);
    //     // if (data.data.errors) {
    //     //     showError(
    //     //         'caller/subgraphCaller.ts->callSubgraph() [Error from Subgraph]',
    //     //         JSON.stringify(data.data.errors, null, 1),
    //     //     );
    //     // }
    //     return data.data;
    // }).catch(err => {
    //     if (err.response) {
    //         // Request made and server responded
    //         showError(
    //             'caller/subgraphCaller.ts->callSubgraph()',
    //             `<${err.response.status} ${err.response.statusText}> on url ${err.response.config.url}`,
    //         );
    //     } else if (err.request) {
    //         // The request was made but no response was received
    //         showError(
    //             'caller/subgraphCaller.ts->callSubgraph()',
    //             `Axios request without response: ${err.request}`,
    //         );
    //     } else {
    //         // Something happened in setting up the request that triggered an Error
    //         showError(
    //             'caller/subgraphCaller.ts->callSubgraph()',
    //             `Axios error on setting up the request: ${err.message}`,
    //         );
    //     }
    //     return null;
    // });
}

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
}

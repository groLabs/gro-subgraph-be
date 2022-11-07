import axios from 'axios';
import { Route } from '../types';
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
    timestamp: number,
): Promise<any> => {
    let q;
    if (isEthSubgraph(url)) {
        if (route === Route.PERSONAL_STATS) {
            q = queryPersonalStatsEth(
                account,
                first,
                skip
            );
        } else if (route === Route.GRO_STATS) {
            q = queryGroStatsEth(
                first,
                skip,
                timestamp
            );
        } else {
            showError(
                'caller/subgraphCaller.ts->callSubgraph()',
                `unknown route ${route}}`,
            );
            return null;
        }
    } else if (isAvaxSubgraph(url)) {
        if (route === Route.PERSONAL_STATS) {
            q = queryPersonalStatsAvax(
                account,
                first,
                skip
            );
        } else if (route === Route.GRO_STATS) {
            q = queryGroStatsAvax(
                first,
                skip,
                timestamp,
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
            `unknown subgraph api ${url}}`,
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

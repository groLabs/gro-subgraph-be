import axios from 'axios';
// import { showError } from '../handler/logHandler';
import { queryPersonalStatsEth } from '../graphql/personalStatsEth';
import { queryPersonalStatsAvax } from '../graphql/personalStatsAvax';
import { SUBGRAPH_URL } from '../constants';

export const callSubgraph = async (
    query: string,
    account: string,
    first: number,
    skip: number
) => {
    let q;
    const URL = (query === 'personalStatsEth')
        ? SUBGRAPH_URL.ETH_PROD_HOSTED
        : (query === 'personalStatsAvax')
            ? SUBGRAPH_URL.AVAX_PROD_HOSTED
            : 'NO_URL';

    switch (query) {
        case 'personalStatsEth':
            q = queryPersonalStatsEth(
                account,
                first,
                skip
            )
            break;
        case 'personalStatsAvax':
            q = queryPersonalStatsAvax(
                account,
                first,
                skip
            )
            break;
        default:
            // showError(
            //     'subgraphCaller.ts.ts->callSubgraph()',
            //     `Invalid subgraph request (${query})`,
            // );
            console.log('errorin');
            return null;
    }

    const result = await axios.post(
        URL,
        { query: q }
    );

    if (result.data.errors) {
        for (const err of result.data.errors) {
            // showError(
            //     'subgraphCaller.ts->callSubgraph()',
            //     `Error: ${err.message}`,
            // );
            console.log(`${err.message}`);
        }
    }

    return result.data.data;
}

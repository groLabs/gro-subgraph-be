import axios from 'axios';
import { showError } from '../handler/logHandler';
import { queryPersonalStatsEth } from '../graphql/personalStatsEth';
import { queryPersonalStatsAvax } from '../graphql/personalStatsAvax';
import {
    isEthSubgraph,
    isAvaxSubgraph
} from '../utils/utils';


// TODO: typed return
export const callSubgraph = async (
    url: string,
    account: string,
    first: number,
    skip: number
) => {
    let q;
    if (isEthSubgraph(url)) {
        q = queryPersonalStatsEth(
            account,
            first,
            skip
        );
    } else if (isAvaxSubgraph(url)) {
        q = queryPersonalStatsAvax(
            account,
            first,
            skip
        );
    } else {
        showError(
            'subgraphCaller.ts->callSubgraph()',
            `unknown subgraph api ${url}}`,
        );
        return null;
    }
    const result = await axios.post(
        url,
        { query: q }
    );
    if (result.data.errors) {
        for (const err of result.data.errors) {
            showError(
                'subgraphCaller.ts->callSubgraph()',
                err.message,
            );
        }
    }
    return result.data.data;
}

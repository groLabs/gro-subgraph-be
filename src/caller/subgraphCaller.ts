import axios from 'axios';
import { showError } from '../handler/logHandler';
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
    skip: number
): Promise<any> => {
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

import { getPersonalStats } from '../handler/personalStatsHandler';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStatsTotals';
import { personalStatsError } from '../parser/personalStatsError';
import { Subgraph } from '../types';
import { getUrl } from '../utils/utils';
import {
    showInfo,
    showError
} from '../handler/logHandler';
import { Env } from '../types';


export const etlPersonalStatsSubgraph = async (
    subgraph: Subgraph,
    _account: string,
    skip: number,
    result: any
) => {
    try {
        const account = _account.toLowerCase(); // Subgraphs store addresses in lowercase
        const url = getUrl(subgraph);
        const [
            resultEth,
            resultAvax,
        ] = await Promise.all([
            getPersonalStats(
                url.ETH,
                account,
                skip,
                result
            ),
            getPersonalStats(
                url.AVAX,
                account,
                skip,
                result
            )
        ]);
        if (resultEth && resultAvax) {
            const resultEthParsed = parsePersonalStatsSubgraphEthereum(
                account,
                resultEth
            );
            const resultAvaxParsed = parsePersonalStatsSubgraphAvalanche(
                account,
                resultAvax
            );
            const resultTotals = personalStatsSubgraphParserTotals(
                resultEthParsed,
                resultAvaxParsed
            );
            showInfo(`Personal stats requested for user ${account}`);
            if (process.env.NODE_ENV === Env.DEV)
                console.dir(resultTotals, { depth: null });
            return resultTotals;
        } else {
            return personalStatsError;
        }
    } catch (err) {
        showError('etlSubgraph.ts->etlPersonalStatsSubgraph()', err);
        return personalStatsError;
    }
}

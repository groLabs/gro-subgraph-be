import { Subgraph } from '../types';
import { getPersonalStats } from '../handler/personalStatsHandler';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStatsTotals';
import { personalStatsError } from '../parser/personalStatsError';
import { IPersonalStatsTotals } from '../interfaces/personalStats/IPersonalStats';
import {
    now,
    getUrl,
} from '../utils/utils';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


export const etlPersonalStats = async (
    subgraph: Subgraph,
    _account: string,
    skip: number,
    result: any
): Promise<IPersonalStatsTotals> => {
    const path = 'etl/etlSubgraph.ts->etlPersonalStats()';
    try {
        const account = _account.toLowerCase(); // Subgraphs store addresses in lowercase
        const url = getUrl(subgraph);

        const [resultEth, resultAvax] = await Promise.all([
            getPersonalStats(url.ETH, account, skip, result),
            getPersonalStats(url.AVAX, account, skip, result),
        ]);

        if (resultEth.errors || resultAvax.errors) {
            const errors = resultEth.errors
                ? resultEth.errors
                : resultAvax.errors;
            return personalStatsError(now(), _account, errors);
        }

        if (resultEth && resultAvax) {
            const resultEthParsed = parsePersonalStatsSubgraphEthereum(account, resultEth);
            const resultAvaxParsed = parsePersonalStatsSubgraphAvalanche(resultAvax);
            const resultTotals = personalStatsSubgraphParserTotals(resultEthParsed, resultAvaxParsed);
            showInfo(`Personal stats requested for user ${account}`);
            return resultTotals;
        }

        return personalStatsError(now(), _account, `Unknown error in ${path}`);
    } catch (err) {
        showError('etl/etlSubgraph.ts->etlPersonalStats()', err);
        return personalStatsError(now(), _account, err as string);
    }
}

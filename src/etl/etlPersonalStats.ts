import { parseGraphQlError } from '../utils/utils';
import { getPersonalStats } from '../handler/personalStatsHandler';
import { emptyAvaxUser } from '../parser/personalStats/personalStatsEmpty';
import { personalStatsError } from '../parser/personalStats/personalStatsError';
import { IPersonalStatsTotals } from '../interfaces/personalStats/IPersonalStats';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStats/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStats/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStats/personalStatsTotals';
import {
    now,
    getUrl,
} from '../utils/utils';
import {
    showInfo,
    showError,
} from '../handler/logHandler';
import {
    Status,
    Subgraph,
} from '../types';


/// @notice Extracts personal stats for a given user from Ethereum and Avalanche subgraphs, and combines the results
/// @dev Queries both Ethereum and Avalanche subgraphs, parses the results, and returns the combined personal stats
/// @dev If there's a maintenance in TheGraph's hosted service, query only the ethereum subgraph
/// @param subgraph The subgraph to be used for querying personal stats data
/// @param _account The user's address
/// @return A Promise that resolves to an IPersonalStatsTotals object containing the combined personal stats from Ethereum and Avalanche
export const etlPersonalStats = async (
    subgraph: Subgraph,
    _account: string,
): Promise<IPersonalStatsTotals> => {
    const path = 'etl/etlSubgraph.ts->etlPersonalStats()';
    try {
        const account = _account.toLowerCase(); // Subgraphs store addresses in lowercase
        const url = getUrl(subgraph);
        const isMaintenance = (process.env.HOSTED_SERVICE_MAINTENANCE === 'true') ? true : false;

        const promises = [getPersonalStats(url.ETH, account, 0, [])];
        if (!isMaintenance) {
            promises.push(getPersonalStats(url.AVAX, account, 0, []));
        }

        const results = await Promise.all(promises);
        const resultEth = results[0];
        const resultAvax = !isMaintenance ? results[1] : null;

        if (resultEth.errors || (resultAvax && resultAvax.errors)) {
            const errors = resultEth.errors
                ? parseGraphQlError(resultEth)
                : parseGraphQlError(resultAvax);
            return personalStatsError(now(), _account, errors);
        }

        if (resultEth && isMaintenance) {
            const resultEthParsed = parsePersonalStatsSubgraphEthereum(account, resultEth);
            const resultAvaxParsed = emptyAvaxUser(Status.WARNING);
            const resultTotals = personalStatsSubgraphParserTotals(resultEthParsed, resultAvaxParsed);
            showInfo(`Personal stats requested for user ${account} | showing only ethereum data`);
            return resultTotals;
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

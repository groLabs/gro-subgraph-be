import {
    Status,
    Subgraph,
} from '../types';
import { parseGraphQlError } from '../utils/utils';
import { groStatsParser } from '../parser/groStats/groStats';
import { groStatsError } from '../parser/groStats/groStatsError';
import { emptyGroStatsAvax } from '../parser/groStats/groStatsEmpty';
import { getGroStats } from '../handler/groStatsHandler';
import { IGroStats } from '../interfaces/groStats/IGroStats';
import { groStatsParserEthereum } from '../parser/groStats/groStatsEth';
import { groStatsParserAvalanche } from '../parser/groStats/groStatsAvax';
import {
    now,
    getUrl,
} from '../utils/utils';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


/// @notice Retrieves and processes Gro Stats data from Ethereum and Avalanche subgraphs
/// @dev Retrieve strategy harvests from the last 15d
/// @dev If there's a maintenance in TheGraph's hosted service, query only the ethereum subgraph
/// @param subgraph The subgraph object containing Ethereum or Avalanche subgraph URLs
/// @return A combined and processed Gro Stats object or an error object if any errors occurred
export const etlGroStats = async (
    subgraph: Subgraph,
): Promise<IGroStats> => {
    try {
        let err_msg = '';
        const tsNow = parseInt(now());
        const url = getUrl(subgraph);
        const isMaintenance = (process.env.HOSTED_SERVICE_MAINTENANCE === 'true') ? true : false;
        
        const promises = [getGroStats(url.ETH, tsNow)];
        if (!isMaintenance) {
            promises.push(getGroStats(url.AVAX, tsNow));
        }

        const results = await Promise.all(promises);
        const resultEth = results[0];
        const resultAvax = !isMaintenance ? results[1] : null;
        
        if (resultEth.errors) {
            err_msg = parseGraphQlError(resultEth);
            return groStatsError(tsNow.toString(), err_msg);
        }
        if (resultAvax && resultAvax.errors) {
            err_msg = parseGraphQlError(resultAvax);
            return groStatsError(tsNow.toString(), err_msg);
        }
        if (resultEth && isMaintenance) {
            const resultEthParsed = groStatsParserEthereum(resultEth, tsNow);
            const resultAvaxParsed = emptyGroStatsAvax(Status.WARNING);
            const resultTotals = groStatsParser(resultEthParsed, resultAvaxParsed);
            showInfo('Gro stats requested | showing only ethereum data');
            return resultTotals;
        }
        if (resultEth && resultAvax) {
            const resultEthParsed = groStatsParserEthereum(resultEth, tsNow);
            const resultAvaxParsed = groStatsParserAvalanche(resultAvax);
            const resultTotals = groStatsParser(resultEthParsed, resultAvaxParsed);
            showInfo('Gro stats requested');
            return resultTotals;
        }
        const errorMsg = resultEth
            ? 'Error in avalanche subgraph call -> please see server logs'
            : 'Error in ethereum subgraph call -> please see server logs';
        return groStatsError(tsNow.toString(), errorMsg);
    } catch (err) {
        showError('etl/etlGroStats.ts->etlGroStats()', err);
        return groStatsError(
            now(),
            err as string,
        );
    }
}

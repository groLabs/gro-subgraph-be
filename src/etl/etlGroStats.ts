import { Subgraph } from '../types';
import { parseGraphQlError } from '../utils/utils';
import { groStatsParser } from '../parser/groStats';
import { groStatsError } from '../parser/groStatsError';
import { getGroStats } from '../handler/groStatsHandler';
import { IGroStats } from '../interfaces/groStats/IGroStats';
import { groStatsParserEthereum } from '../parser/groStatsEth';
import { groStatsParserAvalanche } from '../parser/groStatsAvax';
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
/// @param subgraph The subgraph object containing Ethereum or Avalanche subgraph URLs
/// @return A combined and processed Gro Stats object or an error object if any errors occurred
export const etlGroStats = async (
    subgraph: Subgraph,
): Promise<IGroStats> => {
    try {
        let err_msg = '';
        const tsNow = parseInt(now());
        const url = getUrl(subgraph);
        const [resultEth, resultAvax] = await Promise.all([
            getGroStats(url.ETH, tsNow),
            getGroStats(url.AVAX, tsNow),
        ]);
        if (resultEth.errors) {
            err_msg = parseGraphQlError(resultEth);
            return groStatsError(tsNow.toString(), err_msg);
        }
        if (resultAvax.errors) {
            err_msg = parseGraphQlError(resultAvax);
            return groStatsError(tsNow.toString(), err_msg);
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

import { Subgraph } from '../types';
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


// @dev: get strategy harvests from the last 15d
export const etlGroStats = async (
    subgraph: Subgraph,
    skip: number,
): Promise<IGroStats> => {
    try {
        const tsNow = parseInt(now());
        const url = getUrl(subgraph);
        const [resultEth, resultAvax] = await Promise.all([
            getGroStats(url.ETH, skip, tsNow),
            getGroStats(url.AVAX, skip, tsNow),
        ]);
        if (resultEth.errors) {
            return groStatsError(tsNow.toString(), resultEth.errors);
        }
        if (resultAvax.errors) {
            return groStatsError(tsNow.toString(), resultAvax.errors);
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

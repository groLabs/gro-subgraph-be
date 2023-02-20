import { getPersonalStats } from '../handler/personalStatsHandler';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStatsTotals';
import { personalStatsError } from '../parser/personalStatsError';
import { IPersonalStatsTotals } from '../interfaces/personalStats/IPersonalStats';
import { Subgraph } from '../types';
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
        if (resultEth.errors) {
            return personalStatsError(
                now(),
                _account,
                resultEth.errors.map((item: any) => item)
            );
        } else if (resultAvax.errors) {
            return personalStatsError(
                now(),
                _account,
                resultAvax.errors.map((item: any) => item)
            );
        } else if (resultEth && resultAvax) {
            const resultEthParsed = parsePersonalStatsSubgraphEthereum(
                account,
                resultEth
            );
            const resultAvaxParsed = parsePersonalStatsSubgraphAvalanche(
                resultAvax
            );
            const resultTotals = personalStatsSubgraphParserTotals(
                resultEthParsed,
                resultAvaxParsed
            );
            showInfo(`Personal stats requested for user ${account}`);
            // if (process.env.NODE_ENV === Env.DEV)
            //     console.dir(resultTotals, { depth: null });
            return resultTotals;
        } else {
            return personalStatsError(
                now(),
                _account,
                'Unknown error in /etl/etlSubgraph->etlPersonalStats()'
            );
        }
    } catch (err) {
        showError('etl/etlSubgraph.ts->etlPersonalStats()', err);
        return personalStatsError(
            now(),
            _account,
            err as string
        );
    }
}

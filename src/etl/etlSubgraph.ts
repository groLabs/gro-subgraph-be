import { callSubgraph } from '../caller/subgraphCaller';
import {
    showInfo,
    showError
} from '../handler/logHandler';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStatsTotals';
import { Subgraph } from '../types';
import { SUBGRAPH_URL } from '../constants';
import {
    getUrl,
    // isEthSubgraph,
    // isAvaxSubgraph,
} from '../utils/utils';

const ITERATION = 800;

export const etlPersonalStatsSubgraph = async (
    subgraph: Subgraph,
    account: string,
    skip: number,
    result: any
) => {
    try {
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
        console.dir(resultTotals, { depth: null });
        return resultTotals;
    } catch (err) {
        showError(
            'etlSubgraph.ts->etlPersonalStatsSubgraph()',
            `Error: ${err}`,
        );
    }
}

const getPersonalStats = async (
    url: string,
    account: string,
    skip: number,
    result: any
): Promise<any> => {
    try {
        const data = await callSubgraph(
            url,
            account,
            ITERATION,
            skip
        );
        if (!data) {
            // TODO: return response with error / throw 'Error during subgraph API call';
            console.log(`No data returned from subgraph API (e.g.: invalid URL)`);
            return null;
        } else if (data.users.length === 0) {
            // const network = isEthSubgraph(target)
            //     ? 'Ethereum network'
            //     : isAvaxSubgraph(target)
            //         ? 'Avalanche network'
            //         : 'Unknown network';
            // showInfo(`User ${account} not found in subgraph for ${network}`);
            return data;
        } else {
            if (skip === 0) {
                result = data;
            } else {
                const transfers = result.users[0].transfers.concat(data.users[0].transfers);
                result.users[0].transfers = transfers;
            }
            return (data.users[0].transfers.length < ITERATION)
                ? result
                : getPersonalStats(
                    url,
                    account,
                    skip + ITERATION,
                    result
                );
        }
    } catch (err) {
        showError(
            'etlSubgraph.ts->getPersonalStats()',
            `${err}`,
        );
    }
}

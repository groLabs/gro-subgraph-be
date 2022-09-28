import { callSubgraph } from '../caller/subgraphCaller';
import {
    showInfo,
    showError
} from '../handler/logHandler';
import { parsePersonalStatsSubgraphEthereum } from '../parser/personalStatsEth';
import { parsePersonalStatsSubgraphAvalanche } from '../parser/personalStatsAvax';
import { personalStatsSubgraphParserTotals } from '../parser/personalStatsTotals'

const ITERATION = 800;

export const etlPersonalStatsSubgraph = async (
    account: string,
    skip: number,
    result: any
) => {
    try {
        const [
            resultEth,
            resultAvax,
        ] = await Promise.all([
            getPersonalStats(
                'personalStatsEth',
                account,
                skip,
                result
            ),
            getPersonalStats(
                'personalStatsAvax',
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
        //const res = JSON.parse(resultTotals);
        return resultTotals;
    } catch (err) {
        showError(
            'etlSubgraph.ts->etlPersonalStatsSubgraph()',
            `Error: ${err}`,
        );
    }
}

const getPersonalStats = async (
    target: string,
    account: string,
    skip: number,
    result: any
): Promise<any> => {
    try {
        const data = await callSubgraph(
            target,
            account,
            ITERATION,
            skip
        );
        if (!data) {
            // TODO: return response with error / throw 'Error during subgraph API call';
            console.log(`Error calling subgraph API`);
            return null;
        } else if (data.users.length === 0) {
            const network = (target === 'personalStatsEth')
                ? 'Ethereum network'
                : (target === 'personalStatsAvax')
                    ? 'Avalanche network'
                    : 'Unknown network';
            showInfo(`User ${account} not found in subgraph for ${network}`);
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
                    target,
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

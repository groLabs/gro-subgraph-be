import { callSubgraph } from '../caller/subgraphCaller';
import {
    showInfo,
    showError
} from '../handler/logHandler';
const ITERATION = 800;


export const getPersonalStats = async (
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
            return null;
        } else if (data.users.length === 0) {
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
        showError('personalStatsHandlers.ts->getPersonalStats()', err);
    }
}
import {
    TX_ITERATION,
    NUM_TRANSFER_CHECKS,
} from '../constants';
import { Route } from '../types'; '../types';
import { showError } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';
import { ITransferTxSubgraph } from '../interfaces/subgraph/ITransferTxSubgraph';


export const getPersonalStats = async (
    url: string,
    account: string,
    lastBlockTS: number,
    result: any = null,
): Promise<any> => {
    try {
        const call = await callSubgraph(
            url,
            account,
            TX_ITERATION,   // 999 records
            lastBlockTS,    // 0 at the beginning
            Route.GRO_PERSONAL_POSITION_MC,
            0,
        );
        if (call.errors) {
            return call;
        } else if (!call) {
            return null;
        } else if (call.data.users.length === 0) {
            return call.data;
        } else {
            let currentTransfers: ITransferTxSubgraph[] = call.data.users[0].transfers;
            const currentTransfersLength = currentTransfers.length;
            if (lastBlockTS === 0) {
                // ** First iteration **
                result = call.data;
                // Get highest block timestamp from last transfer (as it's sorted ascending)
                lastBlockTS = (currentTransfersLength > 0)
                    ? currentTransfers[currentTransfersLength - 1].timestamp
                    : 0;
            } else if (currentTransfersLength > 0) {
                // ** Next iterations **
                // Get last previous N Transfers (normally 3)
                const prev: ITransferTxSubgraph[] = result.users[0].transfers.slice(
                    Math.max(result.users[0].transfers.length - NUM_TRANSFER_CHECKS, 0)
                );
                // Remove any new Transfer already stored in result
                currentTransfers = removeRepeated(currentTransfers, prev);
                // Add new Transfers to the previous ones
                result.users[0].transfers = result.users[0].transfers
                    .concat(currentTransfers);
                // In case one only current Transfer that has actually been removed
                lastBlockTS = (currentTransfers.length > 0)
                    ? currentTransfers[currentTransfers.length - 1].timestamp
                    : prev[prev.length - 1].timestamp;
            }
            
            const isReady = currentTransfersLength === 0 || currentTransfersLength < TX_ITERATION;

            // Transfers are extracted is ascending order but sent to the FE in descending order
            if (isReady) {
                result.users[0].transfers
                    .sort((a: ITransferTxSubgraph, b: ITransferTxSubgraph) => b.timestamp - a.timestamp);
            }

            return (isReady)
                ? result
                : getPersonalStats(
                    url,
                    account,
                    lastBlockTS,
                    result
                );
        }
    } catch (err) {
        showError('handler/personalStatsHandler.ts->getPersonalStats()', err);
        return null;
    }
}

// Remove any repeated record from last Transfers call that already existed in previous calls
// This is needed because the the graphql query is based on block number 'gte', so when doing iterations,
// any previous Transfer needs to be removed from the last Transfers call, and also because there can be
// multiple Transfers with same block number (eg: emergency withdrawal)
// e.g.: 0xb58d5e530a42e6cc150310ed187c0d78812a8ee709fe842ad2d6931ba32a06c7
const removeRepeated = (
    curr: ITransferTxSubgraph[],
    prev: ITransferTxSubgraph[]
): ITransferTxSubgraph[] => {
    curr = curr.filter((currItem) =>
        !prev.some((prevItem) =>
            prevItem.block_number === currItem.block_number && prevItem.token === currItem.token
        )
    );
    return curr;
}
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
    result: any
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
            
            const isReady = (currentTransfersLength === 0 || currentTransfersLength < TX_ITERATION)
                ? true
                : false;

            // Transfer are extracted is ascending order, but sent to the FE in descending order
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


// Goal: This is to handle multiple transfers in the same transaction (therefore, same block timestamp
// for different records in entity TransferTx), as the block timestamp is used to filter the calls and without
// a proper handling, there could be repeated records.
// How: compares the three last Transfers from the previous call vs. up to three first Transfers
// from the last call and deletes Transfers from the last call if already existing in the previous call
// Only comparing 3 records, as there shouldn't be Transfers with more than 3 Gro-tokens in the same Tx.
// e.g.: 0xb58d5e530a42e6cc150310ed187c0d78812a8ee709fe842ad2d6931ba32a06c7
const removeRepeated = (
    curr: ITransferTxSubgraph[],
    prev: ITransferTxSubgraph[]
): ITransferTxSubgraph[] => {
    for (let z = 0; z < prev.length; z++) {
        if (
            curr[0]
            && prev[z].block_number == curr[0].block_number
            && prev[z].token == curr[0].token
        ) {
            curr.shift();
        } else if (
            curr[1]
            && prev[z].block_number == curr[1].block_number
            && prev[z].token == curr[1].token
        ) {
            curr.slice(1, 1);
        } else if (
            curr[2]
            && prev[z].block_number == curr[2].block_number
            && prev[z].token == curr[2].token
        ) {
            curr.slice(2, 1);
        }
    }
    return curr;
}

import moment from 'moment';
import { RPC_PROVIDER as provider } from '../constants';
import { sendDiscordMessage } from '../handler/discordHandler';
import { IBlockNumbers } from '../interfaces/blockNumbers/IBlockNumbers';
import {
    TS_1D,
    BLOCKS_PER_DAY,
} from '../constants';
import {
    showInfo,
    showError,
} from '../handler/logHandler';
import {
    Status,
    DiscordAlert,
} from '../types';


// Store the data in memory
export let blockData: IBlockNumbers = {
    lastExecutionTimestamp: null,
    latestBlockNumber: null,
    blockNumberNDaysAgo: null,
    dummyBlockNumber: 17200000, // arbitrary block to prevent the graphql query failing if getBlockNumber() does not resolve
    status: Status.ERROR,
};

/// @notice Fetches and updates the latest Ethereum block number and the block number from N days ago to be
///         able to calculate the GVT APY afterwards
/// @dev This function will only update data if not called before or it's been more than 24h since the last call
///      to restrict the amount of infura calls to one a day
/// @param days The number of days ago for which the block number should be fetched
/// @return A promise that resolves to an IBlockNumbers object with blocks data
export const getBlockNumbers = async (days: number): Promise<IBlockNumbers> => {
    try {
        // Get the current timestamp
        const now = moment.utc();

        // Update values if this function hasn't been called before or if it's been more than 24 hours since the last call
        if (!blockData.lastExecutionTimestamp || now.diff(blockData.lastExecutionTimestamp, 'seconds') >= TS_1D) {

            // Store latest block number & block number N days ago
            blockData.latestBlockNumber = await provider.getBlockNumber();
            const blocksPerWeek = days * BLOCKS_PER_DAY;
            blockData.blockNumberNDaysAgo = blockData.latestBlockNumber - blocksPerWeek;

            // Ensure this block number isn't less than 0
            blockData.blockNumberNDaysAgo = Math.max(blockData.blockNumberNDaysAgo, 0);

            // Update the last execution timestamp & status
            blockData.lastExecutionTimestamp = now;
            blockData.status = Status.OK;

            const msgBlocks = `latestBlock: ${blockData.latestBlockNumber}, latestBlock${days}d: ${blockData.blockNumberNDaysAgo},`;
            const msgTs = `latestExecutionTs: ${blockData.lastExecutionTimestamp.format('DD/MM/YYYY HH:mm:ss A z')}`;
            showInfo(`Blocks for gvt apy calc updated -> ${msgBlocks} ${msgTs}`);
        }
        return blockData;
    } catch (err) {
        showError('caller/blockCaller.ts->getBlockNumbers()', err);
        blockData.status = Status.ERROR;
        await sendDiscordMessage(
            DiscordAlert.BOT_ALERT,
            '[WARN] E8 - RPC call failed',
            err as string,
        );
        return blockData;
    }
}

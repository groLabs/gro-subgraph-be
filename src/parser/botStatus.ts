import { showError } from '../handler/logHandler';
import {
    Status,
    NetworkId,
} from '../types';
import {
    IBotStatus,
    IBotStatusNetwork,
} from '../interfaces/botStatus/IBotStatus';
import {
    botStatusError,
    botStatusNetworkError,
} from './botStatusError';


const parseStatus = (status: any, networkId: NetworkId): IBotStatusNetwork => {
    if (status.errors)
        return botStatusNetworkError(status.errors, networkId);
    if (!status.data)
        return botStatusNetworkError('Missing data from subgraph', networkId);
    if (status.data._meta.hasIndexingErrors)
        return botStatusNetworkError('Subgraph has indexing errors', networkId);
    return {
        'status': Status.OK,
        'error_msg': '',
        'network_id': status.data.masterDatas[0].network_id,
        'has_indexing_errors': status.data._meta.hasIndexingErrors,
        'launch_timestamp': status.data.masterDatas[0].launch_timestamp,
        'block_number': status.data._meta.block.number,
    };
}

export const botStatusParser = (
    statusEth: any,
    statusAvax: any,
): IBotStatus => {
    try {        
        const ethResult = parseStatus(statusEth, NetworkId.MAINNET);
        const avaxResult = parseStatus(statusAvax, NetworkId.AVALANCHE);
        const result = {
            'bot_status': {
                'status': (ethResult.status === Status.OK && avaxResult.status === Status.OK) ? Status.OK : Status.ERROR,
                'error_msg': '',
                'network': {
                    [NetworkId.MAINNET]: ethResult,
                    [NetworkId.AVALANCHE]: avaxResult
                }
            }
        }
        return result;
    } catch (err) {
        showError('botStatus.ts->botStatusParser()', err);
        return botStatusError(err as string);
    }
}

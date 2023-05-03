import {
    Status,
    NetworkId
} from '../types';
import {
    IBotStatus,
    IBotStatusNetwork,
} from '../interfaces/botStatus/IBotStatus';


export const botStatusNetworkError = (
    error_msg: string,
    networkId: NetworkId,
): IBotStatusNetwork => {
    const result = {
        'status': Status.ERROR,
        'error_msg': error_msg,
        'network_id': parseInt(networkId),
        'has_indexing_errors': null,
        'launch_timestamp': null,
        'block_number': null,
    }
    return result;
}

export const botStatusError = (
    error_msg: string,
): IBotStatus => {
    const result = {
        'bot_status': {
            'status': Status.ERROR,
            'error_msg': error_msg,
            'network': {}
        }
    }
    return result;
}

import {
    Status,
    NetworkId,
} from '../../types';


export interface IBotStatusNetwork {
    readonly 'status': Status,
    readonly 'error_msg': string,
    readonly 'network_id': number,
    readonly 'has_indexing_errors': boolean | null,
    readonly 'launch_timestamp': number | null,
    readonly 'block_number': number | null,
}

export interface IBotStatus {
    readonly 'bot_status': {
        readonly 'status': Status,
        readonly 'error_msg': string,
        readonly 'network': {
            [K in NetworkId]?: IBotStatusNetwork
        }
    }
}

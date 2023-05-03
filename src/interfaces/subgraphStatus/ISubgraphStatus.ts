import {
    Status,
    NetworkId,
} from '../../types';

export interface ISubgraphStatusNetwork {
    readonly 'status': Status,
    readonly 'error_msg': string,
    readonly 'network_id': NetworkId,
    readonly 'deployment_id': string,
}

export interface ISubgraphStatus {
    readonly 'subgraph_status': {
        readonly 'status': Status,
        readonly 'current_timestamp': string,
        readonly 'networks': ISubgraphStatusNetwork[],
    }
}

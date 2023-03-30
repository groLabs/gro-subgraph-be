import { Status } from '../../types';

export interface IStatusNetwork {
    readonly 'status': Status,
    readonly 'error_msg': string,
    readonly 'deployment_id': string,
}

export interface IStatus {
    readonly 'status': Status,
    readonly 'current_timestamp': string,
    readonly 'networks': IStatusNetwork[],
}

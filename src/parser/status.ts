import { Status } from '../types';
import {
    IStatus,
    IStatusNetwork,
} from '../interfaces/status/IStatus';


export const statusNetwork = (
    status: Status,
    error: string,
    deploymentId: string
) => ({
    'status': status,
    'error_msg': error,
    'deployment_id': deploymentId,
});

export const statusNetworkError = (
    err: Error | string,
): IStatusNetwork[] => ([{
    'status': Status.ERROR,
    'error_msg': err instanceof Error ? err.message : err,
    'deployment_id': 'N/A',
}]);

export const globalStatus = (
    status: Status,
    ts: string,
    networks: IStatusNetwork[],
): IStatus => ({
    'status': status,
    'current_timestamp': ts,
    'networks': networks,
});

import { Status } from '../types';
import {
    ISubgraphStatus,
    ISubgraphStatusNetwork,
} from '../interfaces/subgraphStatus/ISubgraphStatus';


/// @notice Constructs a status network object with the given status, error,
///         and deployment ID
/// @param status The status of the network
/// @param error The error message, if any
/// @param deploymentId The subgraph deployment ID
/// @return An object representing the status of the network
export const statusNetwork = (
    status: Status,
    error: string,
    deploymentId: string
) => ({
    'status': status,
    'error_msg': error,
    'deployment_id': deploymentId,
});

/// @notice Constructs an array of ISubgraphStatusNetwork objects with an error status
///         and the given error message
/// @dev Used to create an error status network array for a given error message
/// @param err The error message or error object
/// @return An array containing a single ISubgraphStatusNetwork object with an error status
///         and the given error message
export const statusNetworkError = (
    err: Error | string,
): ISubgraphStatusNetwork[] => ([{
    'status': Status.ERROR,
    'error_msg': err instanceof Error ? err.message : err,
    'deployment_id': 'N/A',
}]);


/// @notice Constructs a global status object with the given status, timestamp,
///         and network statuses
/// @param status The overall status of the system
/// @param ts The current timestamp
/// @param networks An array of network status objects
/// @return An object representing the global status of the system
export const globalStatus = (
    status: Status,
    ts: string,
    networks: ISubgraphStatusNetwork[],
): ISubgraphStatus => ({
    'subgraph_status': {
        'status': status,
        'current_timestamp': ts,
        'networks': networks,
    }
});

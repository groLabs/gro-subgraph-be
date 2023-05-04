import { IErrorResponse } from './IErrorResponse';

/// @notice Defines the structure of an status call object
export interface IBotStatusCallData {
    readonly 'data': {
        readonly 'masterDatas': {
            readonly 'network_id': number,
            readonly 'launch_timestamp': number,
        }[],
        readonly '_meta': {
            readonly 'hasIndexingErrors': boolean,
            readonly 'block': {
                readonly 'number': number,
            }
        }
    }
}

export type IBotStatusCall = IBotStatusCallData | IErrorResponse;

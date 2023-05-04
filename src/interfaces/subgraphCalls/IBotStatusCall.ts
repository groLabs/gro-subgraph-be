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

export interface IBotStatusCallError {
    readonly 'errors': string;
}

export type IBotStatusCall = IBotStatusCallData | IBotStatusCallError;

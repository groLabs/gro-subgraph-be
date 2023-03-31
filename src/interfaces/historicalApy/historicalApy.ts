import { Status } from '../../types';

export interface IApy {
    readonly 'gvt': number,
    readonly 'date': number,
    readonly 'pwrd': number,
}

interface IResponse {
    readonly 'attribute': string,
    readonly 'frequency': string,
    readonly 'start': string,
    readonly 'end': string,
    readonly 'results': IApy[],
}

export interface IResponses {
    readonly 'response1': IResponse,
    readonly 'response2': IResponse,
    readonly 'response3': IResponse,
}

export interface IHistoricalApy {
    readonly 'historical_stats': {
        readonly 'status': Status,
        readonly 'error_msg': string | null,
        readonly 'current_timestamp': string,
        readonly 'launch_timestamp': string,
        readonly 'network': string,
        readonly 'response1': IResponse | [],
        readonly 'response2': IResponse | [],
        readonly 'response3': IResponse | [],
    }
}

export interface IHistoricalApyCheck {
    status: Status,
    msg: string,
    data: any[],
}

import { Status } from '../../types';


interface IApy {
    'gvt': number,
    'date': number,
    'pwrd': number,
}

interface IResponse {
    'attribute': string,
    'frequency': string,
    'start': string,
    'end': string,
    'results': IApy[],
}

export interface IResponses {
    'response1': IResponse,
    'response2': IResponse,
    'response3': IResponse,
}

export interface IHistoricalApy {
    'historical_stats': {
        'status': Status,
        'error_msg': string | null,
        'current_timestamp': string,
        'launch_timestamp': string,
        'network': string,
        'response1': IResponse | [],
        'response2': IResponse | [],
        'response3': IResponse | [],
    }
}

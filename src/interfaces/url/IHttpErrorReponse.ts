import { Status } from '../../types';


export interface IHttpErrorReponse {
    readonly 'subgraph_bot': {
        readonly 'status': Status,
        readonly 'error_code': number,
        readonly 'error_msg': string,
    }
}

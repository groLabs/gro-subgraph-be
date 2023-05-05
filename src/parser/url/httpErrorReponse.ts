import { Status } from '../../types';
import { showError } from '../../handler/logHandler';
import { IHttpErrorReponse } from '../../interfaces/url/IHttpErrorReponse';


export const httpErrorReponse = (
    err_code: number,
    err_msg: string,
    url: string,
): IHttpErrorReponse => {
    const response = {
        'subgraph_bot': {
            'status': Status.ERROR,
            'error_code': err_code,
            'error_msg': `${err_msg} at ${url}`,
        }
    }
    showError('parser/url/httpErrorReponse.ts->httpErrorReponse()', err_msg);
    return response;
}

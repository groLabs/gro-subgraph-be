import { Status } from '../../types';

export interface IQuery {
    readonly 'status': Status,
    readonly 'data': string,
}
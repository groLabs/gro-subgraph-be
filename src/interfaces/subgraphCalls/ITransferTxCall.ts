import {
    Token,
    TxType,
} from '../../types';

export interface ITransferTxCall {
    readonly block_number: number
    readonly timestamp: number
    readonly hash: string
    readonly type: TxType
    readonly token: Token
    readonly coin_amount: string
    readonly usd_amount: string
}

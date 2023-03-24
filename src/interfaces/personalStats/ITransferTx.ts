import {
    Token,
    TxType,
} from '../../types';

export interface ITransferTx {
    readonly block: string
    readonly timestamp: string
    readonly hash: string
    readonly type: TxType
    readonly token: Token
    readonly coinAmount: number
    readonly usdAmount: number
}

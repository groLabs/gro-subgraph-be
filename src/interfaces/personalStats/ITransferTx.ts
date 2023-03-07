import {
    Token,
    TxType,
} from '../../types';

export interface ITransferTx {
    block: string
    timestamp: string
    hash: string
    type: TxType
    token: Token
    coinAmount: number
    usdAmount: number
}

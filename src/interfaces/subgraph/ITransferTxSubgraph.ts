import {
    Token,
    TxType,
} from '../../types';

export interface ITransferTxSubgraph {
    block_number: number
    timestamp: number
    hash: string
    type: TxType
    token: Token
    coin_amount: string
    usd_amount: string
}

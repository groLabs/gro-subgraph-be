import {
    Token,
    TxType,
} from '../types';

export interface ITransferTx {
    // id: string
    // contractAddress: string
    block: number
    timestamp: number
    hash: string
    type: TxType
    token: Token
    // userAddress: string
    // fromAddress: string
    // toAddress: string
    coinAmount: number
    usdAmount: number
    // poolId: number
    // factor: number
}

import {
    Token,
    TxType,
} from '../../types';

export interface ITransferTx {
    // id: string
    // contractAddress: string
    block: string
    timestamp: string
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

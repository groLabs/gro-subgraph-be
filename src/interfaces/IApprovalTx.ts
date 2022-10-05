import {
    Token,
    TxType,
} from '../types';

export interface IApprovalTx {
//   id: string
//   contractAddress: string
  block: number
  timestamp: number
  hash: string
  type: TxType
  token: Token
//   ownerAddress: string
  spenderAddress: string
  coinAmount: number
  usdAmount: number
}

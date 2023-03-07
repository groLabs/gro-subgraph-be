import {
    Token,
    TxType,
} from '../../types';

export interface IApprovalTx {
  block: string
  timestamp: string
  hash: string
  type: TxType
  token: Token
  spenderAddress: string
  coinAmount: number
  usdAmount: number
}

import {
    Token,
    TxType,
} from '../../types';

export interface IApprovalTx {
  readonly block: string
  readonly timestamp: string
  readonly hash: string
  readonly type: TxType
  readonly token: Token
  readonly spenderAddress: string
  readonly coinAmount: number
  readonly usdAmount: number
}

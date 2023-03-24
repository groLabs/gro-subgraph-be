import { Status } from '../../types';

export interface IGroGate {
    readonly 'status': Status,
    readonly 'total_claimable_allowance': string,
    readonly 'total_remaining_allowance': string,
    readonly 'snapshot_ts': string,
    readonly 'gro_balance_at_snapshot': string,
    readonly 'gro_gate_at_snapshot': string,
    readonly 'proofs': [],
    readonly 'root': string,
    readonly 'root_matched': string,
    readonly 'groDAI.e_vault': {
        readonly 'claimable_allowance': string,
        readonly 'remaining_allowance': string,
        readonly 'claimable': string,
        readonly 'base_allowance': string,
        readonly 'base_allowance_claimed': string
    },
    readonly 'groUSDC.e_vault': {
        readonly 'claimable_allowance': string,
        readonly 'remaining_allowance': string,
        readonly 'claimable': string,
        readonly 'base_allowance': string,
        readonly 'base_allowance_claimed': string
    },
    readonly 'groUSDT.e_vault': {
        readonly 'claimable_allowance': string,
        readonly 'remaining_allowance': string,
        readonly 'claimable': string,
        readonly 'base_allowance': string,
        readonly 'base_allowance_claimed': string
    }
}

import { Status } from '../types';

export interface IGroGate {
    'status': Status,
    'total_claimable_allowance': string,
    'total_remaining_allowance': string,
    'snapshot_ts': string,
    'gro_balance_at_snapshot': string,
    'gro_gate_at_snapshot': string,
    'proofs': [],
    'root': string,
    'root_matched': string,
    'groDAI.e_vault': {
        'claimable_allowance': string,
        'remaining_allowance': string,
        'claimable': string,
        'base_allowance': string,
        'base_allowance_claimed': string
    },
    'groUSDC.e_vault': {
        'claimable_allowance': string,
        'remaining_allowance': string,
        'claimable': string,
        'base_allowance': string,
        'base_allowance_claimed': string
    },
    'groUSDT.e_vault': {
        'claimable_allowance': string,
        'remaining_allowance': string,
        'claimable': string,
        'base_allowance': string,
        'base_allowance_claimed': string
    }
}

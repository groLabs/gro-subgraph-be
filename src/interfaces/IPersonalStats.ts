import { IPool } from './IPool';
import { IGroGate } from './IGroGate';
import { ITransferTx } from './ITransferTx';
import { IApprovalTx } from './IApprovalTx';
import { IVestingBonus } from './IVestingBonus';
import { IVestingAirdrop } from './IVestingAirdrop';
import {
    Status,
    NetworkName
} from '../types';


interface ITotalsEthereum {
    'pwrd': string,
    'gvt': string,
    'total': string
}

interface ITotalsAvalanche {
    'groDAI.e_vault': string,
    'groUSDC.e_vault': string,
    'groUSDT.e_vault': string,
    'groDAI.e_vault_v1_7': string,
    'groUSDC.e_vault_v1_7': string,
    'groUSDT.e_vault_v1_7': string,
    'total': string
}

interface ITotalsSummary {
    'ethereum': string,
    'avalanche': string,
    'total': string
}


export interface IPersonalStatsEthereum {
    'status': Status,
    'network_id': string,
    'airdrops': [],
    'transaction': {
        'deposits': ITransferTx[],
        'withdrawals': ITransferTx[],
        'transfers_in': ITransferTx[],
        'transfers_out': ITransferTx[],
        'approvals': IApprovalTx[],
        'failures': []
    },
    'current_timestamp': string,
    'launch_timestamp': string,
    'network': NetworkName,
    'amount_added': ITotalsEthereum,
    'amount_removed': ITotalsEthereum,
    'net_amount_added': ITotalsEthereum,
    'current_balance': ITotalsEthereum,
    'net_returns': ITotalsEthereum,
    'net_returns_ratio': ITotalsEthereum,
    'vest_bonus': IVestingBonus,
    'pools': {
        'all': IPool,
        'single_staking_100_gro_0': IPool,
        'uniswap_v2_5050_gro_gvt_1': IPool,
        'uniswap_v2_5050_gro_usdc_2': IPool,
        'single_staking_100_gvt_3': IPool,
        'curve_meta_pwrd_3crv_4': IPool,
        'balancer_v2_8020_gro_weth_5': IPool,
        'single_staking_100_pwrd_6': IPool
    },
    'address': string,
    'gro_balance_combined': string,
    'vesting_airdrop': IVestingAirdrop
}

export interface IPersonalStatsAvalanche {
    'status': Status,
    'launch_timestamp': string,
    'amount_added': ITotalsAvalanche,
    'amount_removed': ITotalsAvalanche,
    'net_amount_added': ITotalsAvalanche,
    'current_balance': ITotalsAvalanche,
    'net_returns': ITotalsAvalanche,
    'transaction': {
        'deposits': ITransferTx[],
        'withdrawals': ITransferTx[],
        'transfers_in': ITransferTx[],
        'transfers_out': ITransferTx[],
        'approvals': IApprovalTx[],
        'failures': []
    },
    'gro_gate': IGroGate,
    'network_id': string
}

export interface IPersonalStatsTotals {
    'gro_personal_position_mc': {
        'status': Status,
        'current_timestamp': string,
        'address': string,
        'network': string,
        'mc_totals': {
            'amount_added': ITotalsSummary,
            'amount_removed': ITotalsSummary,
            'net_amount_added': ITotalsSummary,
            'current_balance': ITotalsSummary,
            'net_returns': ITotalsSummary
        },
        'ethereum': IPersonalStatsEthereum,
        'avalanche': IPersonalStatsAvalanche
    }
}
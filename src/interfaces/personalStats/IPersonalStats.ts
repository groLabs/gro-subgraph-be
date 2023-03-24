import { IPool } from './IPool';
import { IPrice } from './IPrice';
import { IAirdrop } from './IAirdrop';
import { IGroGate } from './IGroGate';
import { ITransferTx } from './ITransferTx';
import { IApprovalTx } from './IApprovalTx';
import { IVestingBonus } from './IVestingBonus';
import { IVestingAirdrop } from './IVestingAirdrop';
import { IGroBalanceCombinedDetail } from './IGroBalanceCombined';
import {
    Status,
    NetworkId,
    NetworkName,
} from '../../types';

interface ITotalsEthereum {
    readonly 'pwrd': string,
    readonly 'gvt': string,
    readonly 'total': string
}

interface ITotalsAvalanche {
    readonly 'groDAI.e_vault': string,
    readonly 'groUSDC.e_vault': string,
    readonly 'groUSDT.e_vault': string,
    readonly 'groDAI.e_vault_v1_7': string,
    readonly 'groUSDC.e_vault_v1_7': string,
    readonly 'groUSDT.e_vault_v1_7': string,
    readonly 'total': string
}

interface ITotalsSummary {
    readonly 'ethereum': string,
    readonly 'avalanche': string,
    readonly 'total': string
}

export interface IPersonalStatsEthereum {
    readonly 'status': Status,
    readonly 'network_id': NetworkId,
    readonly 'prices': IPrice,
    readonly 'airdrops': IAirdrop[],
    readonly 'transaction': {
        readonly 'deposits': ITransferTx[],
        readonly 'withdrawals': ITransferTx[],
        readonly 'transfers_in': ITransferTx[],
        readonly 'transfers_out': ITransferTx[],
        readonly 'approvals': IApprovalTx[],
        readonly 'staker_deposits': ITransferTx[],
        readonly 'staker_withdrawals': ITransferTx[],
        readonly 'failures': []
    },
    readonly 'current_timestamp': string,
    readonly 'launch_timestamp': string,
    readonly 'network': NetworkName,
    readonly 'amount_added': ITotalsEthereum,
    readonly 'amount_removed': ITotalsEthereum,
    readonly 'net_amount_added': ITotalsEthereum,
    readonly 'current_balance': ITotalsEthereum,
    readonly 'net_returns': ITotalsEthereum,
    readonly 'vest_bonus': IVestingBonus,
    readonly 'pools': {
        readonly 'all': IPool,
        readonly 'single_staking_100_gro_0': IPool,
        readonly 'uniswap_v2_5050_gro_gvt_1': IPool,
        readonly 'uniswap_v2_5050_gro_usdc_2': IPool,
        readonly 'single_staking_100_gvt_3': IPool,
        readonly 'curve_meta_pwrd_3crv_4': IPool,
        readonly 'balancer_v2_8020_gro_weth_5': IPool,
        readonly 'single_staking_100_pwrd_6': IPool
    },
    readonly 'address': string,
    readonly 'gro_balance_combined': string,
    readonly 'gro_balance_combined_detail': IGroBalanceCombinedDetail,
    readonly 'vesting_airdrop': IVestingAirdrop
}

export interface IPersonalStatsAvalanche {
    readonly 'status': Status,
    readonly 'launch_timestamp': string,
    readonly 'amount_added': ITotalsAvalanche,
    readonly 'amount_removed': ITotalsAvalanche,
    readonly 'net_amount_added': ITotalsAvalanche,
    readonly 'current_balance': ITotalsAvalanche,
    readonly 'net_returns': ITotalsAvalanche,
    readonly 'transaction': {
        readonly 'deposits': ITransferTx[],
        readonly 'withdrawals': ITransferTx[],
        readonly 'transfers_in': ITransferTx[],
        readonly 'transfers_out': ITransferTx[],
        readonly 'approvals': IApprovalTx[],
        readonly 'failures': []
    },
    readonly 'gro_gate': IGroGate,
    readonly 'network_id': NetworkId
}

export interface IPersonalStatsTotals {
    readonly 'gro_personal_position_mc': {
        readonly 'status': Status,
        readonly 'error_msg': string,
        readonly 'current_timestamp': string,
        readonly 'address': string,
        readonly 'network': NetworkName,
        readonly 'mc_totals': {
            readonly 'amount_added': ITotalsSummary,
            readonly 'amount_removed': ITotalsSummary,
            readonly 'net_amount_added': ITotalsSummary,
            readonly 'current_balance': ITotalsSummary,
            readonly 'net_returns': ITotalsSummary
        },
        readonly 'ethereum': IPersonalStatsEthereum,
        readonly 'avalanche': IPersonalStatsAvalanche
    }
}
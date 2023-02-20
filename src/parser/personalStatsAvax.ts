import { NA } from '../constants';
import { toStr } from '../utils/utils';
import { showError } from '../handler/logHandler';
import { emptyAvaxUser } from './personalStatsEmpty';
import { ITransferTx } from '../interfaces/personalStats/ITransferTx';
import { IApprovalTx } from '../interfaces/personalStats/IApprovalTx';
import { IPersonalStatsAvalanche } from '../interfaces/personalStats/IPersonalStats';
import {
    Status,
    NetworkId,
} from '../types';


export const parsePersonalStatsSubgraphAvalanche = (
    stats_avax: any
): IPersonalStatsAvalanche => {
    try {
        if (stats_avax.users.length === 0)
            return emptyAvaxUser(Status.OK);

        const md_avax = stats_avax.masterDatas[0];
        const totals_avax = stats_avax.users[0].totals;
        const transfers_avax: ITransferTx[] = stats_avax.users[0].transfers;
        const approvals_avax: IApprovalTx[] = stats_avax.users[0].approvals;

        // Pre-calculations
        const currentBalance_groDAI_e_v1_0 = (parseFloat(stats_avax.prices[0].groDAI_e_v1_0) > 0)
            ? parseFloat(totals_avax.net_amount_groDAI_e_v1_0)
            / parseFloat(stats_avax.prices[0].groDAI_e_v1_0)
            : 0;
        const currentBalance_groUSDC_e_v1_0 = (parseFloat(stats_avax.prices[0].groUSDC_e_v1_0) > 0)
            ? parseFloat(totals_avax.net_amount_groUSDC_e_v1_0)
            / parseFloat(stats_avax.prices[0].groUSDC_e_v1_0)
            : 0;
        const currentBalance_groUSDT_e_v1_0 = (parseFloat(stats_avax.prices[0].groUSDT_e_v1_0) > 0)
            ? parseFloat(totals_avax.net_amount_groUSDT_e_v1_0)
            / parseFloat(stats_avax.prices[0].groUSDT_e_v1_0)
            : 0;
        const currentBalance_groDAI_e_v1_7 = (parseFloat(stats_avax.prices[0].groDAI_e_v1_7) > 0)
            ? parseFloat(totals_avax.net_amount_groDAI_e_v1_7)
            / parseFloat(stats_avax.prices[0].groDAI_e_v1_7)
            : 0;
        const currentBalance_groUSDC_e_v1_7 = (parseFloat(stats_avax.prices[0].groUSDC_e_v1_7) > 0)
            ? parseFloat(totals_avax.net_amount_groUSDC_e_v1_7)
            / parseFloat(stats_avax.prices[0].groUSDC_e_v1_7)
            : 0;
        const currentBalance_groUSDT_e_v1_7 = (parseFloat(stats_avax.prices[0].groUSDT_e_v1_7) > 0)
            ? parseFloat(totals_avax.net_amount_groUSDT_e_v1_7)
            / parseFloat(stats_avax.prices[0].groUSDT_e_v1_7)
            : 0;

        const currentBalanceTotal =
            currentBalance_groDAI_e_v1_0
            + currentBalance_groUSDC_e_v1_0
            + currentBalance_groUSDT_e_v1_0
            + currentBalance_groDAI_e_v1_7
            + currentBalance_groUSDC_e_v1_7
            + currentBalance_groUSDT_e_v1_7;
        const netReturns_groDAI_e_v1_0 =
            currentBalance_groDAI_e_v1_0
            - parseFloat(totals_avax.net_value_groDAI_e_v1_0);
        const netReturns_groUSDC_e_v1_0 =
            currentBalance_groUSDC_e_v1_0
            - parseFloat(totals_avax.net_value_groUSDC_e_v1_0);
        const netReturns_groUSDT_e_v1_0 =
            currentBalance_groUSDT_e_v1_0
            - parseFloat(totals_avax.net_value_groUSDT_e_v1_0);
        const netReturns_groDAI_e_v1_7 =
            currentBalance_groDAI_e_v1_7
            - parseFloat(totals_avax.net_value_groDAI_e_v1_7);
        const netReturns_groUSDC_e_v1_7 =
            currentBalance_groUSDC_e_v1_7
            - parseFloat(totals_avax.net_value_groUSDC_e_v1_7);
        const netReturns_groUSDT_e_v1_7 =
            currentBalance_groUSDT_e_v1_7
            - parseFloat(totals_avax.net_value_groUSDT_e_v1_7);
        const netReturnsTotal =
            netReturns_groDAI_e_v1_0
            + netReturns_groUSDC_e_v1_0
            + netReturns_groUSDT_e_v1_0
            + netReturns_groDAI_e_v1_7
            + netReturns_groUSDC_e_v1_7
            + netReturns_groUSDT_e_v1_7;

        const result: IPersonalStatsAvalanche = {
            'status': md_avax.status as Status,
            'network_id': md_avax.network_id as NetworkId,
            'launch_timestamp': md_avax.launch_timestamp as string,
            'amount_added': {
                'groDAI.e_vault': toStr(totals_avax.value_added_groDAI_e_v1_0),
                'groUSDC.e_vault': toStr(totals_avax.value_added_groUSDC_e_v1_0),
                'groUSDT.e_vault': toStr(totals_avax.value_added_groUSDT_e_v1_0),
                'groDAI.e_vault_v1_7': toStr(totals_avax.value_added_groDAI_e_v1_7),
                'groUSDC.e_vault_v1_7': toStr(totals_avax.value_added_groUSDC_e_v1_7),
                'groUSDT.e_vault_v1_7': toStr(totals_avax.value_added_groUSDT_e_v1_7),
                'total': toStr(totals_avax.value_added_total),
            },
            'amount_removed': {
                'groDAI.e_vault': toStr(totals_avax.value_removed_groDAI_e_v1_0),
                'groUSDC.e_vault': toStr(totals_avax.value_removed_groUSDC_e_v1_0),
                'groUSDT.e_vault': toStr(totals_avax.value_removed_groUSDT_e_v1_0),
                'groDAI.e_vault_v1_7': toStr(totals_avax.value_removed_groDAI_e_v1_7),
                'groUSDC.e_vault_v1_7': toStr(totals_avax.value_removed_groUSDC_e_v1_7),
                'groUSDT.e_vault_v1_7': toStr(totals_avax.value_removed_groUSDT_e_v1_7),
                'total': toStr(totals_avax.value_removed_total),
            },
            'net_amount_added': {
                'groDAI.e_vault': toStr(totals_avax.net_value_groDAI_e_v1_0),
                'groUSDC.e_vault': toStr(totals_avax.net_value_groUSDC_e_v1_0),
                'groUSDT.e_vault': toStr(totals_avax.net_value_groUSDT_e_v1_0),
                'groDAI.e_vault_v1_7': toStr(totals_avax.net_value_groDAI_e_v1_7),
                'groUSDC.e_vault_v1_7': toStr(totals_avax.net_value_groUSDC_e_v1_7),
                'groUSDT.e_vault_v1_7': toStr(totals_avax.net_value_groUSDT_e_v1_7),
                'total': toStr(totals_avax.net_value_total),
            },
            'current_balance': {
                'groDAI.e_vault': toStr(currentBalance_groDAI_e_v1_0),
                'groUSDC.e_vault': toStr(currentBalance_groUSDC_e_v1_0),
                'groUSDT.e_vault': toStr(currentBalance_groUSDT_e_v1_0),
                'groDAI.e_vault_v1_7': toStr(currentBalance_groDAI_e_v1_7),
                'groUSDC.e_vault_v1_7': toStr(currentBalance_groUSDC_e_v1_7),
                'groUSDT.e_vault_v1_7': toStr(currentBalance_groUSDT_e_v1_7),
                'total': toStr(currentBalanceTotal),
            },
            'net_returns': {
                'groDAI.e_vault': toStr(netReturns_groDAI_e_v1_0),
                'groUSDC.e_vault': toStr(netReturns_groUSDC_e_v1_0),
                'groUSDT.e_vault': toStr(netReturns_groUSDT_e_v1_0),
                'groDAI.e_vault_v1_7': toStr(netReturns_groDAI_e_v1_7),
                'groUSDC.e_vault_v1_7': toStr(netReturns_groUSDC_e_v1_7),
                'groUSDT.e_vault_v1_7': toStr(netReturns_groUSDT_e_v1_7),
                'total': toStr(netReturnsTotal),
            },
            'transaction': {
                'deposits': transfers_avax.filter((item: ITransferTx) => item.type === 'core_deposit'),
                'withdrawals': transfers_avax.filter((item: ITransferTx) => item.type === 'core_withdrawal'),
                'transfers_in': transfers_avax.filter((item: ITransferTx) => item.type === 'transfer_in'),
                'transfers_out': transfers_avax.filter((item: ITransferTx) => item.type === 'transfer_out'),
                'approvals': approvals_avax,
                'failures': [] as []
            },
            'gro_gate': {
                'status': Status.OK,
                'total_claimable_allowance': NA,
                'total_remaining_allowance': NA,
                'snapshot_ts': NA,
                'gro_balance_at_snapshot': NA,
                'gro_gate_at_snapshot': NA,
                'proofs': [] as [],
                'root': NA,
                'root_matched': NA,
                'groDAI.e_vault': {
                    'claimable_allowance': NA,
                    'remaining_allowance': NA,
                    'claimable': NA,
                    'base_allowance': NA,
                    'base_allowance_claimed': NA
                },
                'groUSDC.e_vault': {
                    'claimable_allowance': NA,
                    'remaining_allowance': NA,
                    'claimable': NA,
                    'base_allowance': NA,
                    'base_allowance_claimed': NA
                },
                'groUSDT.e_vault': {
                    'claimable_allowance': NA,
                    'remaining_allowance': NA,
                    'claimable': NA,
                    'base_allowance': NA,
                    'base_allowance_claimed': NA
                }
            }
        }
        return result;
    } catch (err) {
        showError(
            'parser/personalStatsAvax.ts->parsePersonalStatsSubgraphAvalanche()',
            `${err}`,
        );
        return emptyAvaxUser(Status.ERROR);
    }
}



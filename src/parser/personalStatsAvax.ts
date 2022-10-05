import { showError } from '../handler/logHandler';
import { ITransferTx } from '../interfaces/ITransferTx';
import { IApprovalTx } from '../interfaces/IApprovalTx';
import { emptyAvaxUser } from './personalStatsEmpty';
import { IPersonalStatsAvalanche } from '../interfaces/IPersonalStats';
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
        const currentBalance_groDAI_e_v1_0 =
            parseFloat(totals_avax.net_amount_groDAI_e_v1_0)
            / parseFloat(stats_avax.prices[0].groDAI_e_v1_0);
        const currentBalance_groUSDC_e_v1_0 =
            parseFloat(totals_avax.net_amount_groUSDC_e_v1_0)
            / parseFloat(stats_avax.prices[0].groUSDC_e_v1_0);
        const currentBalance_groUSDT_e_v1_0 =
            parseFloat(totals_avax.net_amount_groUSDT_e_v1_0)
            / parseFloat(stats_avax.prices[0].groUSDT_e_v1_0);
        const currentBalance_groDAI_e_v1_7 =
            parseFloat(totals_avax.net_amount_groDAI_e_v1_7)
            / parseFloat(stats_avax.prices[0].groDAI_e_v1_7);
        const currentBalance_groUSDC_e_v1_7 =
            parseFloat(totals_avax.net_amount_groUSDC_e_v1_7)
            / parseFloat(stats_avax.prices[0].groUSDC_e_v1_7);
        const currentBalance_groUSDT_e_v1_7 =
            parseFloat(totals_avax.net_amount_groUSDT_e_v1_7)
            / parseFloat(stats_avax.prices[0].groUSDT_e_v1_7);
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

        const result = {
            'status': md_avax.status as Status,
            'network_id': md_avax.networkId as NetworkId,
            'launch_timestamp': md_avax.launchTimestamp as string,
            'amount_added': {
                'groDAI.e_vault': totals_avax.value_added_groDAI_e_v1_0 as string,
                'groUSDC.e_vault': totals_avax.value_added_groUSDC_e_v1_0 as string,
                'groUSDT.e_vault': totals_avax.value_added_groUSDT_e_v1_0 as string,
                'groDAI.e_vault_v1_7': totals_avax.value_added_groDAI_e_v1_7 as string,
                'groUSDC.e_vault_v1_7': totals_avax.value_added_groUSDC_e_v1_7 as string,
                'groUSDT.e_vault_v1_7': totals_avax.value_added_groUSDT_e_v1_7 as string,
                'total': totals_avax.value_added_total as string,
            },
            'amount_removed': {
                'groDAI.e_vault': totals_avax.value_removed_groDAI_e_v1_0 as string,
                'groUSDC.e_vault': totals_avax.value_removed_groUSDC_e_v1_0 as string,
                'groUSDT.e_vault': totals_avax.value_removed_groUSDT_e_v1_0 as string,
                'groDAI.e_vault_v1_7': totals_avax.value_removed_groDAI_e_v1_7 as string,
                'groUSDC.e_vault_v1_7': totals_avax.value_removed_groUSDC_e_v1_7 as string,
                'groUSDT.e_vault_v1_7': totals_avax.value_removed_groUSDT_e_v1_7 as string,
                'total': totals_avax.value_removed_total as string,
            },
            'net_amount_added': {
                'groDAI.e_vault': totals_avax.net_value_groDAI_e_v1_0 as string,
                'groUSDC.e_vault': totals_avax.net_value_groUSDC_e_v1_0 as string,
                'groUSDT.e_vault': totals_avax.net_value_groUSDT_e_v1_0 as string,
                'groDAI.e_vault_v1_7': totals_avax.net_value_groDAI_e_v1_7 as string,
                'groUSDC.e_vault_v1_7': totals_avax.net_value_groUSDC_e_v1_7 as string,
                'groUSDT.e_vault_v1_7': totals_avax.net_value_groUSDT_e_v1_7 as string,
                'total': totals_avax.net_value_total as string,
            },
            'current_balance': {
                'groDAI.e_vault': currentBalance_groDAI_e_v1_0.toString(),
                'groUSDC.e_vault': currentBalance_groUSDC_e_v1_0.toString(),
                'groUSDT.e_vault': currentBalance_groUSDT_e_v1_0.toString(),
                'groDAI.e_vault_v1_7': currentBalance_groDAI_e_v1_7.toString(),
                'groUSDC.e_vault_v1_7': currentBalance_groUSDC_e_v1_7.toString(),
                'groUSDT.e_vault_v1_7': currentBalance_groUSDT_e_v1_7.toString(),
                'total': currentBalanceTotal.toString(),
            },
            'net_returns': {
                'groDAI.e_vault': netReturns_groDAI_e_v1_0.toString(),
                'groUSDC.e_vault': netReturns_groUSDC_e_v1_0.toString(),
                'groUSDT.e_vault': netReturns_groUSDT_e_v1_0.toString(),
                'groDAI.e_vault_v1_7': netReturns_groDAI_e_v1_7.toString(),
                'groUSDC.e_vault_v1_7': netReturns_groUSDC_e_v1_7.toString(),
                'groUSDT.e_vault_v1_7': netReturns_groUSDT_e_v1_7.toString(),
                'total': netReturnsTotal.toString(),
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
                'total_claimable_allowance': 'N/A',
                'total_remaining_allowance': 'N/A',
                'snapshot_ts': 'N/A',
                'gro_balance_at_snapshot': 'N/A',
                'gro_gate_at_snapshot': 'N/A',
                'proofs': []  as [],
                'root': 'N/A',
                'root_matched': 'N/A',
                'groDAI.e_vault': {
                    'claimable_allowance': 'N/A',
                    'remaining_allowance': 'N/A',
                    'claimable': 'N/A',
                    'base_allowance': 'N/A',
                    'base_allowance_claimed': 'N/A'
                },
                'groUSDC.e_vault': {
                    'claimable_allowance': 'N/A',
                    'remaining_allowance': 'N/A',
                    'claimable': 'N/A',
                    'base_allowance': 'N/A',
                    'base_allowance_claimed': 'N/A'
                },
                'groUSDT.e_vault': {
                    'claimable_allowance': 'N/A',
                    'remaining_allowance': 'N/A',
                    'claimable': 'N/A',
                    'base_allowance': 'N/A',
                    'base_allowance_claimed': 'N/A'
                }
            }
        }
        return result;
    } catch (err) {
        showError(
            'personalStatsSubgraphParserAvax.ts->parsePersonalStatsSubgraphAvalanche()',
            `${err}`,
        );
        return emptyAvaxUser(Status.ERROR);
    }
}



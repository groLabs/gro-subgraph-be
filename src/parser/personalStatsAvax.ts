import { showError } from '../handler/logHandler';
import { TransferTx } from '../interfaces/IPersonalStats';

export const parsePersonalStatsSubgraphAvalanche = (
    account: string,
    stats_avax: any
) => {
    try {
        // console.dir(stats_avax, { depth: null });
        if (stats_avax.users.length === 0)
            return NO_AVAX_USER(account);

        // const currentTimestamp = moment().unix();
        const md_avax = stats_avax.masterDatas[0];
        const totals_avax = stats_avax.users[0].totals;
        const transfers_avax = stats_avax.users[0].transfers;
        const approvals_avax = stats_avax.users[0].approvals;

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
            "avalanche": {
                "status": md_avax.status,
                "network_id": md_avax.networkId.toString(),
                "launch_timestamp": md_avax.launchTimestamp,
                "address": stats_avax.users[0].address,
                "amount_added": {
                    "groDAI.e_vault": totals_avax.value_added_groDAI_e_v1_0,
                    "groUSDC.e_vault": totals_avax.value_added_groUSDC_e_v1_0,
                    "groUSDT.e_vault": totals_avax.value_added_groUSDT_e_v1_0,
                    "groDAI.e_vault_v1_7": totals_avax.value_added_groDAI_e_v1_7,
                    "groUSDC.e_vault_v1_7": totals_avax.value_added_groUSDC_e_v1_7,
                    "groUSDT.e_vault_v1_7": totals_avax.value_added_groUSDT_e_v1_7,
                    "total": totals_avax.value_added_total,
                },
                "amount_removed": {
                    "groDAI.e_vault": totals_avax.value_removed_groDAI_e_v1_0,
                    "groUSDC.e_vault": totals_avax.value_removed_groUSDC_e_v1_0,
                    "groUSDT.e_vault": totals_avax.value_removed_groUSDT_e_v1_0,
                    "groDAI.e_vault_v1_7": totals_avax.value_removed_groDAI_e_v1_7,
                    "groUSDC.e_vault_v1_7": totals_avax.value_removed_groUSDC_e_v1_7,
                    "groUSDT.e_vault_v1_7": totals_avax.value_removed_groUSDT_e_v1_7,
                    "total": totals_avax.value_removed_total,
                },
                "net_amount_added": {
                    "groDAI.e_vault": totals_avax.net_value_groDAI_e_v1_0,
                    "groUSDC.e_vault": totals_avax.net_value_groUSDC_e_v1_0,
                    "groUSDT.e_vault": totals_avax.net_value_groUSDT_e_v1_0,
                    "groDAI.e_vault_v1_7": totals_avax.net_value_groDAI_e_v1_7,
                    "groUSDC.e_vault_v1_7": totals_avax.net_value_groUSDC_e_v1_7,
                    "groUSDT.e_vault_v1_7": totals_avax.net_value_groUSDT_e_v1_7,
                    "total": totals_avax.net_value_total,
                },
                "current_balance": {
                    "groDAI.e_vault": currentBalance_groDAI_e_v1_0.toString(),
                    "groUSDC.e_vault": currentBalance_groUSDC_e_v1_0.toString(),
                    "groUSDT.e_vault": currentBalance_groUSDT_e_v1_0.toString(),
                    "groDAI.e_vault_v1_7": currentBalance_groDAI_e_v1_7.toString(),
                    "groUSDC.e_vault_v1_7": currentBalance_groUSDC_e_v1_7.toString(),
                    "groUSDT.e_vault_v1_7": currentBalance_groUSDT_e_v1_7.toString(),
                    "total": currentBalanceTotal.toString(),
                },
                "net_returns": {
                    "groDAI.e_vault": netReturns_groDAI_e_v1_0.toString(),
                    "groUSDC.e_vault": netReturns_groUSDC_e_v1_0.toString(),
                    "groUSDT.e_vault": netReturns_groUSDT_e_v1_0.toString(),
                    "groDAI.e_vault_v1_7": netReturns_groDAI_e_v1_7.toString(),
                    "groUSDC.e_vault_v1_7": netReturns_groUSDC_e_v1_7.toString(),
                    "groUSDT.e_vault_v1_7": netReturns_groUSDT_e_v1_7.toString(),
                    "total": netReturnsTotal.toString(),
                },
                "transaction": {
                    "deposits": transfers_avax.filter((item: TransferTx) => item.type === 'deposit'),
                    "withdrawals": transfers_avax.filter((item: TransferTx) => item.type === 'withdrawal'),
                    "transfers_in": transfers_avax.filter((item: TransferTx) => item.type === 'transfer_in'),
                    "transfers_out": transfers_avax.filter((item: TransferTx) => item.type === 'transfer_out'),
                    "approvals": approvals_avax,
                    "failures": []
                },
                "gro_gate": {
                    "status": "N/A",
                    "total_claimable_allowance": "N/A",
                    "total_remaining_allowance": "N/A",
                    "snapshot_ts": "N/A",
                    "gro_balance_at_snapshot": "N/A",
                    "gro_gate_at_snapshot": "N/A",
                    "proofs": [],
                    "root": "N/A",
                    "root_matched": "N/A",
                    "groDAI.e_vault": {
                        "claimable_allowance": "N/A",
                        "remaining_allowance": "N/A",
                        "claimable": "N/A",
                        "base_allowance": "N/A",
                        "base_allowance_claimed": "N/A"
                    },
                    "groUSDC.e_vault": {
                        "claimable_allowance": "N/A",
                        "remaining_allowance": "N/A",
                        "claimable": "N/A",
                        "base_allowance": "N/A",
                        "base_allowance_claimed": "N/A"
                    },
                    "groUSDT.e_vault": {
                        "claimable_allowance": "N/A",
                        "remaining_allowance": "N/A",
                        "claimable": "N/A",
                        "base_allowance": "N/A",
                        "base_allowance_claimed": "N/A"
                    }
                }
            }
        }
        //console.dir(result, { depth: null });
        return result;

    } catch (err) {
        showError(
            'personalStatsSubgraphParserAvax.ts->parsePersonalStatsSubgraphAvalanche()',
            `${err}`,
        );
        return NO_AVAX_USER;
    }
}

export const NO_AVAX_USER = (
    address: string
) => ({
    "avalanche": {
        "status": 'ok',
        "network_id": '43114',
        "launch_timestamp": '1638483222',
        "address": address,
        "amount_added": {
            "groDAI.e_vault": '0',
            "groUSDC.e_vault": '0',
            "groUSDT.e_vault": '0',
            "groDAI.e_vault_v1_7": '0',
            "groUSDC.e_vault_v1_7": '0',
            "groUSDT.e_vault_v1_7": '0',
            "total": '0'
        },
        "amount_removed": {
            "groDAI.e_vault": '0',
            "groUSDC.e_vault": '0',
            "groUSDT.e_vault": '0',
            "groDAI.e_vault_v1_7": '0',
            "groUSDC.e_vault_v1_7": '0',
            "groUSDT.e_vault_v1_7": '0',
            "total": '0'
        },
        "net_amount_added": {
            "groDAI.e_vault": '0',
            "groUSDC.e_vault": '0',
            "groUSDT.e_vault": '0',
            "groDAI.e_vault_v1_7": '0',
            "groUSDC.e_vault_v1_7": '0',
            "groUSDT.e_vault_v1_7": '0',
            "total": '0'
        },
        "current_balance": {
            "groDAI.e_vault": '0',
            "groUSDC.e_vault": '0',
            "groUSDT.e_vault": '0',
            "groDAI.e_vault_v1_7": '0',
            "groUSDC.e_vault_v1_7": '0',
            "groUSDT.e_vault_v1_7": '0',
            "total": '0'
        },
        "net_returns": {
            "groDAI.e_vault": '0',
            "groUSDC.e_vault": '0',
            "groUSDT.e_vault": '0',
            "groDAI.e_vault_v1_7": '0',
            "groUSDC.e_vault_v1_7": '0',
            "groUSDT.e_vault_v1_7": '0',
            "total": '0'
        },
        "transaction": {
            "deposits": [],
            "withdrawals": [],
            "transfers_in": [],
            "transfers_out": [],
            "approvals": [],
            "failures": []
        },
        "gro_gate": {
            "status": "N/A",
            "total_claimable_allowance": "N/A",
            "total_remaining_allowance": "N/A",
            "snapshot_ts": "N/A",
            "gro_balance_at_snapshot": "N/A",
            "gro_gate_at_snapshot": "N/A",
            "proofs": [],
            "root": "N/A",
            "root_matched": "N/A",
            "groDAI.e_vault": {
                "claimable_allowance": "N/A",
                "remaining_allowance": "N/A",
                "claimable": "N/A",
                "base_allowance": "N/A",
                "base_allowance_claimed": "N/A"
            },
            "groUSDC.e_vault": {
                "claimable_allowance": "N/A",
                "remaining_allowance": "N/A",
                "claimable": "N/A",
                "base_allowance": "N/A",
                "base_allowance_claimed": "N/A"
            },
            "groUSDT.e_vault": {
                "claimable_allowance": "N/A",
                "remaining_allowance": "N/A",
                "claimable": "N/A",
                "base_allowance": "N/A",
                "base_allowance_claimed": "N/A"
            }
        }
    }
});

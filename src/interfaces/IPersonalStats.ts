
export interface TransferTx {
    // id: string
    // contractAddress: string
    block: number
    timestamp: number
    hash: string
    type: string
    token: string
    // userAddress: string
    // fromAddress: string
    // toAddress: string
    coinAmount: number
    usdAmount: number
    // poolId: number
    // factor: number
}


// export interface PersonalStatsTotals {
//     "status": string,
//     "current_timestamp": number,
//     "address": string,
//     "network": string,
//     "mc_totals": {
//         "amount_added": {
//             "ethereum": number,
//             "avalanche": number,
//             "total": number
//         },
//         "amount_removed": {
//             "ethereum": number,
//             "avalanche": number,
//             "total": number
//         },
//         "net_amount_added": {
//             "ethereum": number,
//             "avalanche": number,
//             "total": number
//         },
//         "current_balance": {
//             "ethereum": number,
//             "avalanche": number,
//             "total": number
//         },
//         "net_returns": {
//             "ethereum": number,
//             "avalanche": number,
//             "total": number
//         }
//     },
//     "ethereum": personalStatsEth,
// }

// export interface personalStatsEth {
//             "status": string,
//             "network_id": number,
//             "airdrops": [],
//             "transaction": {
//                 "deposits": transfers_eth.filter(item => (
//                     item.type === 'core_deposit'
//                     && onlyGtoken(item.token)
//                 )),
//                 "withdrawals": transfers_eth.filter(item => (
//                     item.type === 'core_withdrawal'
//                     && onlyGtoken(item.token)
//                 )),
//                 "transfers_in": transfers_eth.filter(item => (
//                     item.type === 'transfer_in'
//                     && onlyGtoken(item.token)
//                 )),
//                 "transfers_out": transfers_eth.filter(item => (
//                     item.type === 'transfer_out'
//                     && onlyGtoken(item.token)
//                 )),
//                 "approvals": approvals_eth.filter(item =>
//                     onlyGtoken(item.token)
//                 ),
//                 "failures": []
//             },
//             "current_timestamp": currentTimestamp,
//             "launch_timestamp": md_eth.launchTimestamp,
//             "network": md_eth.networkName,
//             "amount_added": {
//                 "pwrd": totals_eth.value_added_gvt,
//                 "gvt": totals_eth.value_added_pwrd,
//                 "total": totals_eth.value_added_total,
//             },
//             "amount_removed": {
//                 "pwrd": totals_eth.value_removed_gvt,
//                 "gvt": totals_eth.value_removed_pwrd,
//                 "total": totals_eth.value_removed_total,
//             },
//             "net_amount_added": {
//                 "pwrd": totals_eth.net_value_gvt,
//                 "gvt": totals_eth.net_value_pwrd,
//                 "total": totals_eth.net_value_total,
//             },
//             "current_balance": {
//                 "pwrd": currentBalancePwrd.toString(),
//                 "gvt": currentBalanceGvt.toString(),
//                 "total": currentBalanceTotal.toString(),
//             },
//             "net_returns": {
//                 "pwrd": netReturnsPwrd.toString(),
//                 "gvt": netReturnsGvt.toString(),
//                 "total": netReturnsTotal.toString(),
//             },
//             "net_returns_ratio": {
//                 "pwrd": "N/A",
//                 "gvt": "N/A",
//                 "total": "N/A"
//             },
//             "vest_bonus": {
//                 "locked_gro": "N/A",
//                 "net_reward": "N/A",
//                 "rewards": {
//                     "claim_now": "N/A",
//                     "vest_all": "N/A"
//                 }
//             },
//             "pools": {
//                 "all": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "single_staking_100_gro_0": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "uniswap_v2_5050_gro_gvt_1": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "uniswap_v2_5050_gro_usdc_2": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "single_staking_100_gvt_3": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "curve_meta_pwrd_3crv_4": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "balancer_v2_8020_gro_weth_5": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 },
//                 "single_staking_100_pwrd_6": {
//                     "net_reward": "N/A",
//                     "balance": "N/A",
//                     "rewards": {
//                         "claim_now": "N/A",
//                         "vest_all": "N/A"
//                     }
//                 }
//             },
//             "address": stats_eth.users[0].address,
//             "gro_balance_combined": "N/A",
//             "vesting_airdrop": {
//                 "name": "N/A",
//                 "token": "N/A",
//                 "amount": "0.00",
//                 "claim_initialized": "N/A",
//                 "claimed_amount": "0.00",
//                 "claimable_amount": "0.00",
//                 "proofs": []
//             }
//         }


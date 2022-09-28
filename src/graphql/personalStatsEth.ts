export const queryPersonalStatsEth = (
    account: string,
    first: number,
    skip: number
) => (
    `{
        masterDatas {
            status
            networkId
            networkName
            launchTimestamp
        }
        prices {
            gvt
            gro
        }
        factors {
            pwrd
        }
        users(where: {id: "${account}"}) {
            address: id
            totals {
              value_added_gvt
              value_added_pwrd
              value_added_total
              value_removed_gvt
              value_removed_pwrd
              value_removed_total
              net_value_gvt
              net_value_pwrd
              net_value_total
              net_amount_gvt
              net_based_amount_pwrd
              # current_balance_gvt = totals.net_amount_gvt * prices.gvt
              # current_balance_pwrd = totals.net_based_amount_pwrd / factors.pwrd
              # current_balance_total = current_balance_gvt + current_balance_pwrd 
              # net_returns_gvt = current_balance_gvt - totals.net_value_gvt
              # net_returns_pwrd = current_balance_pwrd - totals.net_value_pwrd
              # net_returns_total = current_balance_total - totals.net_value_total
            }
            transfers (
                first: ${first}
                skip: ${skip}
                orderBy: timestamp
                orderDirection: desc
            ) {
                token
                hash
                timestamp
                usd_amount : usdAmount
                coin_amount : coinAmount
                block_number : block
            }
            approvals (
                orderBy: timestamp
                orderDirection: desc
            ) {
                token
                hash
                timestamp
                spender: spenderAddress
                usd_amount : usdAmount
                coin_amount : coinAmount
                block_number : block
            }
        }
    }`
);


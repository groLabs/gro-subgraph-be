export const queryPersonalStatsEth = (
    account: string,
    first: number,
    skip: number
) => (
    `{
        _meta {
            hasIndexingErrors
            block {
              number
              timestamp
            }
        }
        masterDatas {
            status
            networkId
            networkName
            launchTimestamp
        }
        prices {
            gvt
            gro
            uniswap_gvt_gro
            uniswap_gro_usdc
            balancer_gro_weth
            curve_pwrd3crv
        }
        poolDatas {
            poolId
            reserve0
            reserve1
            total_supply
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
                type
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
            pool_0: pools(where: {poolId: 0}) {
                net_reward
                balance
              }
            pool_1: pools(where: {poolId: 1}) {
                net_reward
                balance
            }
            pool_2: pools(where: {poolId: 2}) {
                net_reward
                balance
            }
            pool_3: pools(where: {poolId: 3}) {
                net_reward
                balance
            }
            pool_4: pools(where: {poolId: 4}) {
                net_reward
                balance
            }
            pool_5: pools(where: {poolId: 5}) {
                net_reward
                balance
            }
            pool_6: pools(where: {poolId: 6}) {
                net_reward
                balance
            }
        }
    }`
);


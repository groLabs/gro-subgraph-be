export const queryGroStatsEth = (
    first: number,
    skip: number,
    tsNow: number,
    ts7d: number,
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
        # masterDatas (block:{number: 16615309}) {
            status
            networkId
            gro_per_block
            total_alloc
            util_ratio
            util_ratio_limit
            gvault_release_factor
        }
        prices {
        # prices (block:{number: 16615309}) {
            pwrd
            gvt
            gro
            dai
            usdc
            usdt
            weth
            uniswap_gvt_gro
            uniswap_gro_usdc
            balancer_gro_weth
            curve_pwrd3crv
            threeCrv
        }
        factors {
            pwrd
        }
        coreDatas {
        # coreDatas (block:{number: 16615309}) {
            total_supply_gvt
            total_supply_pwrd_based
            total_supply_gro
            total_supply_uniswap_gvt_gro
            total_supply_uniswap_gro_usdc
            total_supply_curve_pwrd3crv
            total_supply_balancer_gro_weth
        }
        poolDatas {
            id
            reserve0
            reserve1
        }
        stakerDatas (orderBy: id, orderDirection: asc) {
            id
            lp_supply
            pool_share
            alloc_point
            acc_gro_per_share
        }
        poolSwaps (orderBy: block_timestamp, orderDirection: desc, where: {
            block_timestamp_gte: ${tsNow - 86400 * 2.1}
        }) {
            poolId
            amount0_in
            amount1_in
            amount0_out
            amount1_out
            block_timestamp
            virtual_price
        }
        gvaultStrategies {
        # gvaultStrategies (block:{number: 16615309}){
            id
            coin
            metacoin
            protocol
            strat_name
            strat_display_name
            vault_name
            vault_display_name
            vault_address
            strategy_debt
            block_strategy_reported
            block_strategy_withdraw
            locked_profit
            harvests (orderBy: timestamp, orderDirection: desc, where: {
                timestamp_gt: ${ts7d}
            }) {
              timestamp
              gain
              loss
              debtPaid
              debtAdded
              lockedProfit
              excessLoss
              strategyAddress {
                id
              }
            }
        }
    }`
);

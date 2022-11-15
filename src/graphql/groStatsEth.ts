export const queryGroStatsEth = (
    first: number,
    skip: number,
    tsNow: number,
    ts15d: number,
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
            gro_per_block
            total_alloc
        }
        prices {
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
        }
        factors {
            pwrd
        }
        coreDatas {
            total_supply_gvt
            total_supply_pwrd_based
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
        strategies {
            id
            coin
            metacoin
            protocol
            strat_name
            strat_display_name
            vault_name
            vault_display_name
            total_assets_adapter
            total_assets_strategy
            strategy_debt
            block_strategy_reported
            block_hourly_update
            harvests (orderBy: timestamp, orderDirection: desc, where: {
                timestamp_gt: ${ts15d}
            }) {
              timestamp
              gain
              loss
              strategyAddress {
                id
              }
            }
        }
    }`
);

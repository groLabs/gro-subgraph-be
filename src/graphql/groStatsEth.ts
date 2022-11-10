export const queryGroStatsEth = (
    first: number,
    skip: number,
    timestamp: number,
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
        }
        prices {
            pwrd
            gvt
            gro
            dai
            usdc
            usdt
            weth
        }
        factors {
            pwrd
        }
        coreDatas {
            total_supply_gvt
            total_supply_pwrd_based
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
            harvests(orderBy: timestamp, orderDirection: desc, where: {
                timestamp_gt: ${timestamp}
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

export const queryGroStatsAvax = (
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
            network_id
        }
        strategies(orderBy: order, orderDirection: asc) {
            id
            strat_name
            vault_name
            vault_address
            total_assets_strategy
            total_assets_vault
            coin
            metacoin
            tvl_cap
        }
    }`
);

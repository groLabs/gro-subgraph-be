/// @notice Generates a GraphQL query for retrieving Gro protocol statistics from the Avalanche subgraph
/// @dev Constructs a query string to fetch data from the Avalanche subgraph
/// @return A GraphQL query string to fetch data related to the Gro protocol on Avalanche
export const queryGroStatsAvax = () => (
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

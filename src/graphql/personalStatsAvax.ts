/// @notice Generates a GraphQL query for retrieving a user's personal statistics from the Avalanche subgraph
/// @dev Constructs a query string to fetch data from the Avalanche subgraph
/// @param account The user's Avalanche address (lowercase)
/// @param first The maximum number of transfer records to retrieve
/// @param blockTimestamp The minimum block timestamp for transfer records
/// @return A GraphQL query string to fetch personal statistics data related to the Gro protocol on Avalanche
export const queryPersonalStatsAvax = (
    account: string,
    first: number,
    blockTimestamp: number
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
            network_name
            launch_timestamp
        }
        prices {
            groDAI_e_v1_0
            groUSDC_e_v1_0
            groUSDT_e_v1_0
            groDAI_e_v1_7
            groUSDC_e_v1_7
            groUSDT_e_v1_7
        }
        users(where: {id: "${account}"}) {
            address: id
            totals {
              value_added_groDAI_e_v1_0
              value_added_groUSDC_e_v1_0
              value_added_groUSDT_e_v1_0
              value_added_groDAI_e_v1_7
              value_added_groUSDC_e_v1_7
              value_added_groUSDT_e_v1_7
              value_added_total
              value_removed_groDAI_e_v1_0
              value_removed_groUSDC_e_v1_0
              value_removed_groUSDT_e_v1_0
              value_removed_groDAI_e_v1_7
              value_removed_groUSDC_e_v1_7
              value_removed_groUSDT_e_v1_7
              value_removed_total
              net_value_groDAI_e_v1_0
              net_value_groUSDC_e_v1_0
              net_value_groUSDT_e_v1_0
              net_value_groDAI_e_v1_7
              net_value_groUSDC_e_v1_7
              net_value_groUSDT_e_v1_7
              net_value_total
              net_amount_groDAI_e_v1_0
              net_amount_groUSDC_e_v1_0
              net_amount_groUSDT_e_v1_0
              net_amount_groDAI_e_v1_7
              net_amount_groUSDC_e_v1_7
              net_amount_groUSDT_e_v1_7
            }
            transfers (
                first: ${first}
                where: { block_timestamp_gte: ${blockTimestamp} }
                orderBy: block_timestamp
                orderDirection: asc
            ) {
                token
                hash
                timestamp: block_timestamp
                usd_amount
                coin_amount
                block_number
                type
            }
            approvals (
                orderBy: block_timestamp
                orderDirection: desc
            ) {
                token
                hash
                timestamp: block_timestamp
                spender: spender_address
                usd_amount
                coin_amount
                block_number
            }
        }
    }`
);

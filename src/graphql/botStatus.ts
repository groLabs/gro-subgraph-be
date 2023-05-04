// @notice Generates a GraphQL query for retrieving bot status data
// @dev The same query is used both for Ethereum & Avalanche networks
// @return A GraphQL query string to fetch bot status data
export const queryBotStatus = () => (
    `{
        _meta {
            hasIndexingErrors
            block {
              number
            }
        }
        masterDatas {
            network_id
            launch_timestamp
        }
    }`
);

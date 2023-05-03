/// @notice Generates a GraphQL query for retrieving the indexing status of a specified subgraph deployment
/// @dev Constructs a query string to fetch indexing status data from The Graph's API
/// @param deploymentId The subgraph deployment ID for which to query the indexing status
/// @return A GraphQL query string to fetch indexing status data related to the specified subgraph deployment
export const queryGraphStatus = (deploymentId: string) => (
    `{
        indexingStatuses(subgraphs: [${deploymentId}]) {
            subgraph
            synced
            health
            entityCount
            fatalError {
                handler
                message
                deterministic
                block {
                    hash
                    number
                }
            }
            chains {
                chainHeadBlock {
                    number
                }
                earliestBlock {
                    number
                }
                latestBlock {
                    number
                }
            }
        }
    }`
);

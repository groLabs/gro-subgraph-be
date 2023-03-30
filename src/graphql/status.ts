export const queryStatus = (deploymentId: string) => (
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

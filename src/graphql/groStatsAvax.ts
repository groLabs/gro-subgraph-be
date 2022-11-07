export const queryGroStatsAvax = (
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
    }`
);

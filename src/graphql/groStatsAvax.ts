export const queryGroStatsAvax = (
    first: number,
    skip: number
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

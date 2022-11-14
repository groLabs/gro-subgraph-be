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
            networkId
        }
    }`
);

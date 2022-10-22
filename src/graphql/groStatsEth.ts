export const queryGroStatsEth = (
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
        prices {
            gvt
            gro
            weth
        }
        factors {
            pwrd
        }
        coreDatas {
            total_supply_gvt
            total_supply_pwrd_based
        }
    }`
);

export const queryPersonalStatsAvax = (
    account: string,
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
            networkName
            launchTimestamp
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
                skip: ${skip}
                orderBy: timestamp
                orderDirection: desc
            ) {
                token
                hash
                timestamp
                usd_amount : usdAmount
                coin_amount : coinAmount
                block_number : block
                type
            }
            approvals (
                orderBy: timestamp
                orderDirection: desc
            ) {
                token
                hash
                timestamp
                spender: spenderAddress
                usd_amount : usdAmount
                coin_amount : coinAmount
                block_number : block
                type
            }
        }
    }`
);


// export const personalStatsEth = (
//     account: string,
//     first: number,
//     skip: number
// ) => (
//     `{
//         transferTxes (
//             first: ${first}
//             skip: ${skip}
//             orderBy: timestamp
//             orderDirection: desc
//             where: {
//                 userAddress: "${account}"
//             }
//         )
//         {
//             block
//             timestamp
//             hash
//             token
//             type
//             userAddress
//             coinAmount
//             usdAmount
//         }
//     }`
// );

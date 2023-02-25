export const queryPersonalStatsEth = (
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
            network_id
            network_name
            launch_timestamp
            gro_per_block
            total_alloc
            total_locked_amount
            total_bonus
            global_start_time
            init_unlocked_percent
        }
        prices {
            gvt
            gro
            curve_pwrd3crv
            uniswap_gvt_gro
            uniswap_gro_usdc
            balancer_gro_weth
        }
        poolDatas {
            id
            reserve0
            reserve1
            total_supply
        }
        stakerDatas {
            id
            lp_supply
            acc_gro_per_share
            alloc_point
            pool_share
            block_number
            block_timestamp
        }
        factors {
            pwrd
        }
        users(where: {id: "${account}"}) {
            address: id
            totals {
                value_added_gvt
                value_added_pwrd
                value_added_total
                value_removed_gvt
                value_removed_pwrd
                value_removed_total
                net_value_gvt
                net_value_pwrd
                net_value_total
                net_amount_gvt
                net_based_amount_pwrd
                amount_total_gro
                amount_total_gro_team
            }
            vestingBonus {
                locked_gro
                net_reward
                claim_now
                vest_all
                vesting_gro
                latest_start_time
            }
            transfers (
                first: ${first}
                skip: ${skip}
                orderBy: block_timestamp
                orderDirection: desc
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
            pool_0: pools(where: {pool_id: 0}) {
                net_reward
                balance
                reward_debt
              }
            pool_1: pools(where: {pool_id: 1}) {
                net_reward
                balance
                reward_debt
            }
            pool_2: pools(where: {pool_id: 2}) {
                net_reward
                balance
                reward_debt
            }
            pool_3: pools(where: {pool_id: 3}) {
                net_reward
                balance
                reward_debt
            }
            pool_4: pools(where: {pool_id: 4}) {
                net_reward
                balance
                reward_debt
            }
            pool_5: pools(where: {pool_id: 5}) {
                net_reward
                balance
                reward_debt
            }
            pool_6: pools(where: {pool_id: 6}) {
                net_reward
                balance
                reward_debt
            }
        }
    }`
);


export interface IPool {
    readonly 'deposit_url': string,
    readonly 'remove_url': string,
    readonly 'name': string,
    readonly 'display_name': string,
    readonly 'type': string,
    readonly 'display_type': string,
    readonly 'display_order': string,
    readonly 'tokens': string[],
    readonly 'pid': string,
    readonly 'tvl': string,
    readonly 'tvl_staked': string,
    readonly 'staked': string,
    readonly 'unstaked': string,
    readonly 'required_tokens_num': string,
    readonly 'disable': string,
    readonly 'lp_usd_price': string,
    readonly 'apy': {
        readonly 'current': {
            readonly 'total': string,
            readonly 'token': string,
            readonly 'pool_fees': string,
            readonly 'reward': string
        }
    }
}

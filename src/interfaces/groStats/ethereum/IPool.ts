export interface IPool {
    'deposit_url': string,
    'remove_url': string,
    'name': string,
    'display_name': string,
    'type': string,
    'display_type': string,
    'display_order': string,
    'tokens': string[],
    'pid': string,
    'tvl': string,
    'tvl_staked': string,
    'staked': string,
    'unstaked': string,
    'required_tokens_num': string,
    'disable': string,
    'lp_usd_price': string,
    'apy': {
        'current': {
            'total': string,
            'token': string,
            'pool_fees': string,
            'reward': string
        }
    }
}

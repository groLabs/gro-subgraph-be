export interface IPool {
    readonly 'net_reward': string
    readonly 'balance': string,
    readonly 'coinBalance': string,
    readonly 'rewards': {
        readonly 'claim_now': string,
        readonly 'vest_all': string
    }
}

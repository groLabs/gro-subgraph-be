export interface IVestingBonus {
    readonly 'locked_gro': string,
    readonly 'net_reward': string,
    readonly 'rewards': {
        readonly 'claim_now': string,
        readonly 'vest_all': string
    }
}

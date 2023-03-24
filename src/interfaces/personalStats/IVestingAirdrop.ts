export interface IVestingAirdrop {
    readonly 'name': string,
    readonly 'amount': string,
    'claim_initialized': string,
    'claimed_amount': string,
    'claimable_amount': string,
    readonly 'proofs': string[],
    readonly 'token': string,
}

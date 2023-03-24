export interface IVestingAirdropProof {
    readonly 'name': string,
    readonly 'token': string,
    readonly 'root': string,
    readonly 'total': string,
    readonly 'airdrops': [{
        readonly 'address': string,
        readonly 'amount': string,
        readonly 'proofs': string[],
    }],
}

export interface IVestingAirdropProof {
    'name': string,
    'token': string,
    'root': string,
    'total': string,
    'airdrops': [{
        'address': string,
        'amount': string,
        'proofs': string[],
    }],
}

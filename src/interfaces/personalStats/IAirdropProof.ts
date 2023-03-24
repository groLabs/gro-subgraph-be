export interface IAirdropProof {
    readonly 'name': string,
    readonly 'display_name': string,
    readonly 'token': string,
    readonly 'expiry_ts': string,
    readonly 'timestamp': string,
    readonly 'claimable': string,
    readonly 'totalAmount': string,
    readonly 'merkleIndex': string,
    readonly 'root': string,
    readonly 'proofs': {
        [key: string]: {
            readonly 'amount': string,
            readonly 'proof': string[],
        }
    }
}

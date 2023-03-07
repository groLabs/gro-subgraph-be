export interface IAirdropProof {
    'name': string,
    'display_name': string,
    'token': string,
    'expiry_ts': string,
    'timestamp': string,
    'claimable': string,
    'totalAmount': string,
    'merkleIndex': string,
    'root': string,
    'proofs': {
        [key: string]: {
            'amount': string,
            'proof': string[],
        }
    }
}

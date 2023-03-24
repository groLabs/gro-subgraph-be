export interface IGroBalanceCombined {
    readonly 'total': string
    readonly 'detail': IGroBalanceCombinedDetail
}

export interface IGroBalanceCombinedDetail {
    readonly 'unstaked/pool0': string,
    readonly 'pool1': string,
    readonly 'pool2': string,
    readonly 'pool5': string,
    readonly 'vesting':string,
    readonly 'team': string,
}

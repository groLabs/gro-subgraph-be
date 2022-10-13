export interface IGroBalanceCombined {
    'total': string
    'detail': IGroBalanceCombinedDetail
}

export interface IGroBalanceCombinedDetail {
    'unstaked/pool0': string,
    'pool1': string,
    'pool2': string,
    'pool5': string,
    'vesting':string,
    'team': string,
}

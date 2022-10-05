export enum Subgraph {
  UNKNOWN = 'unknown',
  PROD_HOSTED = 'prod_hosted',
  PROD_STUDIO = 'prod_studio',
  TEST_HOSTED = 'test_hosted',
  TEST_STUDIO = 'test_studio',
}

export enum Env {
  PROD = 'prod',
  DEV = 'dev',
}

// @dev: Should be aligned with subgraph schema
export enum Token {
  unknown = 'unknown',
  pwrd = 'pwrd',
  gvt = 'gvt',
  gro = 'gro',
  dai = 'dai',
  usdc = 'usdc',
  usdt = 'usdt',
  balancer_gro_weth = 'balancer_gro_weth',
  uniswap_gvt_gro = 'uniswap_gvt_gro',
  uniswap_gro_usdc = 'uniswap_gro_usdc',
  curve_pwrd3crv = 'curve_pwrd3crv',
}

// @dev: Should be aligned with subgraph schema
export enum TxType {
  core_deposit = 'core_deposit',
  core_withdrawal = 'core_withdrawal',
  staker_deposit = 'staker_deposit',
  staker_withdrawal = 'staker_withdrawal',
  transfer_in = 'transfer_in',
  transfer_out = 'transfer_out',
  claim = 'claim',
  multiclaim = 'multiclaim',
  vest = 'vest',
  approval = 'approval',
}

// @dev: Should be aligned with subgraph schema
export enum Status {
  ok = 'ok',
  error = 'error',
}

// @dev: Should be aligned with subgraph schema
export enum NetworkName {
  mainnet = 'mainnet',
  avalanche = 'avalanche',
}

export enum NetworkId {
  mainnet = '1',
  avalanche = '43114',
}

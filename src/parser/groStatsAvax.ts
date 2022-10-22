import { Status, NetworkName } from '../types';
import { LAUNCH_TIMESTAMP_AVAX } from '../constants';
import { IGroStatsAvalanche } from '../interfaces/groStats/IGroStats';


export const groStatsParserAvalanche = (
    stats_avax: any
): IGroStatsAvalanche => {
    let value = '0'; //TODO: temp
    const md_eth = stats_avax.masterDatas[0];

    const result = {
        'status': md_eth.status as Status,
        'network': NetworkName.AVALANCHE,
        'launch_timestamp': LAUNCH_TIMESTAMP_AVAX,
        'tvl': {
            'groDAI.e_vault': value,
            'groUSDC.e_vault': value,
            'groUSDT.e_vault': value,
            'groDAI.e_vault_v1_5': value,
            'groUSDC.e_vault_v1_5': value,
            'groUSDT.e_vault_v1_5': value,
            'groDAI.e_vault_v1_6': value,
            'groUSDC.e_vault_v1_6': value,
            'groUSDT.e_vault_v1_6': value,
            'groDAI.e_vault_v1_7': value,
            'groUSDC.e_vault_v1_7': value,
            'groUSDT.e_vault_v1_7': value,
            'total': value,
        },
        'token_price_usd': {
            'avax': value,
        },
        'labs_vault': [],
    }
    return result;
}
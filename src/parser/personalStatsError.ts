import {
    Status,
    NetworkName
} from '../types';
import { 
    NO_ETH_USER, 
    NO_AVAX_USER
} from './personalStatsEmpty';
import { IPersonalStatsTotals} from '../interfaces/IPersonalStats';


const emptyTotals = {
    'ethereum': 'N/A',
    'avalanche': 'N/A',
    'total': 'N/A'
}

export const personalStatsError = (
    currentTimestamp: string,
    address: string,
): IPersonalStatsTotals => {
    return {
        'gro_personal_position_mc': {
            'status': Status.error,
            'current_timestamp': currentTimestamp,
            'address': address,
            'network': NetworkName.mainnet,
            'mc_totals': {
                'amount_added': emptyTotals,
                'amount_removed': emptyTotals,
                'net_amount_added': emptyTotals,
                'current_balance': emptyTotals,
                'net_returns': emptyTotals
            },
            'ethereum': NO_ETH_USER(currentTimestamp, address, Status.error),
            'avalanche': NO_AVAX_USER(Status.error)
        }
    }
}

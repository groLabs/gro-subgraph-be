import {
    Status,
    NetworkName
} from '../types';
import { 
    emptyEthUser, 
    emptyAvaxUser
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
            'ethereum': emptyEthUser(currentTimestamp, address, Status.error),
            'avalanche': emptyAvaxUser(Status.error)
        }
    }
}

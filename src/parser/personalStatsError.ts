import { NA } from '../constants';
import { IPersonalStatsTotals} from '../interfaces/personalStats/IPersonalStats';
import {
    Status,
    NetworkName
} from '../types';
import { 
    emptyEthUser, 
    emptyAvaxUser
} from './personalStatsEmpty';


/// @notice Creates an empty totals object with default values
const emptyTotals = {
    'ethereum': NA,
    'avalanche': NA,
    'total': NA
}

/// @notice Creates an IPersonalStatsTotals object with error status and a given error message
/// @param currentTimestamp The current timestamp as a string
/// @param address The user's address as a string
/// @param error_msg The error message to be included in the IPersonalStatsTotals object
/// @return An IPersonalStatsTotals object with error status and a given error message
export const personalStatsError = (
    currentTimestamp: string,
    address: string,
    error_msg: string,
): IPersonalStatsTotals => {
    return {
        'gro_personal_position_mc': {
            'status': Status.ERROR,
            'error_msg': error_msg,
            'current_timestamp': currentTimestamp,
            'address': address,
            'network': NetworkName.MAINNET,
            'mc_totals': {
                'amount_added': emptyTotals,
                'amount_removed': emptyTotals,
                'net_amount_added': emptyTotals,
                'current_balance': emptyTotals,
                'net_returns': emptyTotals
            },
            'ethereum': emptyEthUser(currentTimestamp, address, Status.ERROR),
            'avalanche': emptyAvaxUser(Status.ERROR)
        }
    }
}

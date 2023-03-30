import { QUERY_ERROR } from '../constants';
import { etlGroStats } from './etlGroStats';
import { query } from '../handler/queryHandler';
import { parseHistoricalApyQuery } from '../parser/historicalApy';
import {
    Status,
    Subgraph
} from '../types';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


/// @notice Extracts historical APY data and inserts it into the g2.PROTOCOL_APY database table
/// @dev Gets Gro stats from the Ethereum subgraph, parses the APY data, and inserts it into the database
/// @return A Promise that resolves to void when the operation is completed or an error occurs
export const etlHistoricalApy = async (): Promise<void> => {
    // get gro stats data from ethereum subgraph
    const groStats = await etlGroStats(
        Subgraph.HISTORICAL_APY,
    );
    if (groStats.gro_stats_mc.status === Status.OK) {
        // parse apy data
        const currentTimestamp = parseInt(groStats.gro_stats_mc.current_timestamp);
        const pwrdApy = parseFloat(groStats.gro_stats_mc.mainnet.apy.current.pwrd);
        const gvtApy = parseFloat(groStats.gro_stats_mc.mainnet.apy.current.gvt);
        const paramsPwrd = parseHistoricalApyQuery(currentTimestamp, 1, pwrdApy);
        const paramsGvt = parseHistoricalApyQuery(currentTimestamp, 2, gvtApy);

        // insert APYs into table g2.PROTOCOL_APY
        const [resultPwrd, resultGvt] = await Promise.all([
            query('insert_protocol_apy.sql', paramsPwrd),
            query('insert_protocol_apy.sql', paramsGvt),
        ]);
        
        // show logs
        if (
            resultPwrd.status !== QUERY_ERROR
            && resultGvt.status !== QUERY_ERROR
        ) {
            showInfo(`Historical APY [pwrd: ${pwrdApy} gvt: ${gvtApy}] on timestamp ${currentTimestamp} successfully loaded`);
        } else {
            showError(
                'etl/etlHistoricalApy.ts->etlHistoricalApy()',
                `Error while inserting historical APY into DB on timestamp ${currentTimestamp}`,
            );
        }
    } else {
        showError(
            'etl/etlHistoricalApy.ts->etlHistoricalApy()',
            `Gro stats parsed data from ethereum subgraph not available`,
        );
    }
}

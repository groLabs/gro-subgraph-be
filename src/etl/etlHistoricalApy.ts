import { QUERY_ERROR } from '../constants';
import { query } from '../handler/queryHandler';
import { etlGroStats } from './etlGroStats';
import { parseHistoricalApyQuery } from '../parser/historicalApy';
import {
    Status,
    Subgraph
} from '../types';
import {
    showInfo,
    showError,
} from '../handler/logHandler';


export const etlHistoricalApy = async (): Promise<any> => {
    // get gro stats data from ethereum subgraph
    const groStats = await etlGroStats(
        Subgraph.HISTORICAL_APY,
        0,
        [],
    );
    if (groStats.gro_stats_mc.status === Status.OK) {
        // parse apy data
        let currentTimestamp = parseInt(groStats.gro_stats_mc.current_timestamp);
        let pwrdApy = parseFloat(groStats.gro_stats_mc.mainnet.apy.current.pwrd);
        let gvtApy = parseFloat(groStats.gro_stats_mc.mainnet.apy.current.gvt);
        const paramsPwrd = parseHistoricalApyQuery(currentTimestamp, 1, pwrdApy);
        const paramsGvt = parseHistoricalApyQuery(currentTimestamp, 2, gvtApy);
        // insert apys into table gro.PROTOCOL_APY
        const [
            resultPwrd,
            resultGvt,
        ] = await Promise.all([
            query('insert_protocol_apy.sql', paramsPwrd),
            query('insert_protocol_apy.sql', paramsGvt),
        ]);
        console.log(paramsPwrd);
        // show error if applicable
        if (
            resultPwrd.status !== QUERY_ERROR
            && resultGvt.status !== QUERY_ERROR
        ) {
            showInfo(`historical APYs [pwrd: ${pwrdApy} gvt: ${gvtApy}] successfully loaded`);
        } else {
            showError(
                'loader/historicalApyLoader.ts->etlHistoricalApy()',
                `Error while insterting historical APY into DB`,
            );
        }
    } else {
        showError(
            'loader/historicalApyLoader.ts->etlHistoricalApy()',
            `Error while insterting gro stats from the ethereum subgraph`,
        );
    }
}

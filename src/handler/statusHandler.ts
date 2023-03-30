import {
    Route,
    Status,
} from '../types';
import {
    IStatus,
    IStatusNetwork,
} from '../interfaces/status/IStatus';
import {
    globalStatus,
    statusNetwork,
    statusNetworkError,
} from '../parser/status';
import { now } from '../utils/utils';
import { showInfo } from '../handler/logHandler';
import { callSubgraph } from '../caller/subgraphCaller';
import { IIndexStatues } from '../interfaces/subgraph/IIndexStatuses';


const checkStatus = (_data: IIndexStatues): IStatusNetwork[] => {
    const data = _data.indexingStatuses;
    if (data.length === 0) {
        return [statusNetwork(Status.ERROR, 'deployment/s not found', 'N/A')];
    }
    return data.map(sg => {
        const error = `error: ${JSON.stringify(sg.fatalError)},  chains: ${JSON.stringify(sg.chains)}`;
        if (!sg.synced) {
            return statusNetwork(Status.ERROR, `subgraph not synced -> ${error}`, sg.subgraph);
        } else if (sg.health !== 'healthy') {
            return statusNetwork(Status.ERROR, `subgraph health is ${sg.health}: ${error}`, sg.subgraph);
        } else {
            return statusNetwork(Status.OK, '', sg.subgraph);
        }
    });
}

export const statusHandler = async (): Promise<IStatus> => {
    const tsNow = parseInt(now());
    try {
        const statusURL = process.env.SG_STATUS;
        if (!statusURL) {
            return globalStatus(
                Status.ERROR,
                tsNow.toString(),
                statusNetworkError('env variable <SG_STATUS> missing'),
            );
        } else {
            const result = await callSubgraph(statusURL, '', 0, 0, Route.STATUS, tsNow);
            if (result.errors) {
                return globalStatus(
                    Status.ERROR,
                    tsNow.toString(),
                    statusNetworkError(result.errors),
                );
            } if (result.data) {
                const sg = checkStatus(result.data);
                const error = sg.find((item) => item.status === Status.ERROR);
                showInfo(`Health status requested -> status: [${error ? Status.ERROR : Status.OK}]`);
                return globalStatus(
                    error ? Status.ERROR : Status.OK,
                    tsNow.toString(),
                    sg,
                )
            } else {
                return globalStatus(
                    Status.ERROR,
                    tsNow.toString(),
                    statusNetworkError('unknown error'),
                );
            }
        }
    } catch (err) {
        return globalStatus(
            Status.ERROR,
            tsNow.toString(),
            statusNetworkError(JSON.stringify(err)),
        );
    }
}

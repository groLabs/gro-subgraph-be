import { Subgraph as sg } from '../types';
import { SUBGRAPH_URL as URL } from '../constants';

export const getUrl = (subgraph: sg) => {
    switch (subgraph) {
        case sg.PROD_HOSTED:
            return URL.PROD_HOSTED;
        case sg.PROD_STUDIO:
            return URL.PROD_STUDIO;
        case sg.TEST_HOSTED:
            return URL.TEST_HOSTED;
        case sg.TEST_STUDIO:
            return URL.TEST_STUDIO;
        default:
            return URL.UNKNOWN;
    }
}

export const isEthSubgraph = (url: string): boolean => {
    return (
        url === URL.PROD_HOSTED.ETH
        || url === URL.PROD_STUDIO.ETH
        || url === URL.TEST_HOSTED.ETH
        || url === URL.TEST_STUDIO.ETH
    )
        ? true
        : false;
}

export const isAvaxSubgraph = (url: string): boolean => {
    return (
        url === URL.PROD_HOSTED.AVAX
        || url === URL.PROD_STUDIO.AVAX
        || url === URL.TEST_HOSTED.AVAX
        || url === URL.TEST_STUDIO.AVAX
    )
        ? true
        : false;
}
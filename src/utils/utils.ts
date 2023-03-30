import moment from 'moment';
import { Subgraph as sg } from '../types';
import { BigNumber as BN } from 'bignumber.js';
import { IUrl } from '../interfaces/url/IUrl';


export const getUrl = (subgraph: sg): IUrl => {
    switch (subgraph) {
        case sg.PROD_HOSTED:
            return {
                ETH: process.env.SG_PROD_HOSTED_ETH as string,
                AVAX: process.env.SG_PROD_HOSTED_AVAX as string,
            }
        case sg.PROD_STUDIO:
            return {
                ETH: process.env.SG_PROD_STUDIO_ETH as string,
                AVAX: process.env.SG_PROD_STUDIO_AVAX as string,
            };
        case sg.TEST_HOSTED:
            return {
                ETH: process.env.SG_TEST_HOSTED_ETH as string,
                AVAX: process.env.SG_TEST_HOSTED_AVAX as string,
            }
        case sg.TEST_STUDIO:
            return {
                ETH: process.env.SG_TEST_STUDIO_ETH as string,
                AVAX: process.env.SG_TEST_STUDIO_AVAX as string,
            }
        case sg.HISTORICAL_APY:
            return {
                ETH: process.env.SG_HISTORICAL_APY as string,
                AVAX: process.env.SG_PROD_HOSTED_AVAX as string,
            }
        default:
            return {
                ETH: 'unknown',
                AVAX: 'unknown',
            };
    }
}

export const isEthSubgraph = (url: string): boolean => {
    return (
        url === process.env.SG_PROD_HOSTED_ETH
        || url === process.env.SG_PROD_STUDIO_ETH
        || url === process.env.SG_TEST_HOSTED_ETH
        || url === process.env.SG_TEST_STUDIO_ETH
        || url === process.env.SG_HISTORICAL_APY
    )
        ? true
        : false;
}

export const isAvaxSubgraph = (url: string): boolean => {
    return (
        url === process.env.SG_PROD_HOSTED_AVAX
        || url === process.env.SG_PROD_STUDIO_AVAX
        || url === process.env.SG_TEST_HOSTED_AVAX
        || url === process.env.SG_TEST_STUDIO_AVAX
    )
        ? true
        : false;
}

// @dev: some values from graphql output come as type <any> although they are string
export const toStr = (value: number): string => {
    return (typeof value === 'string')
        ? parseFloat(value).toFixed(7).toString()
        : value.toFixed(7).toString();
}

export const now = (): string => {
    return moment().unix().toString();
}

export const bnToDecimal = (
    amount: BN,
    precision: number,
    decimals: number,
): number => {
    const scale = BN(10).pow(precision);
    const result = BN(amount).div(scale).toFixed(decimals);
    return parseFloat(result);
}

import moment from 'moment';
import {
    NetworkId,
    Subgraph as sg,
} from '../types';
import { BigNumber as BN } from 'bignumber.js';
import { IUrl } from '../interfaces/url/IUrl';


/// @notice Returns the appropriate URL for the specified subgraph
/// @param subgraph The subgraph for which to get the URL
/// @return An IUrl object containing the URLs for the specified subgraph
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

/// @notice Checks if the given URL is for an Ethereum subgraph
/// @param url The URL to check
/// @return True if the URL is for an Ethereum subgraph, false otherwise
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

/// @notice Checks if the given URL is for an Avalanche subgraph
/// @param url The URL to check
/// @return True if the URL is for an Avalanche subgraph, false otherwise
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

/// @notice Converts a number to a string with 7 decimal places
/// @dev Some values from graphql output come as type <any> although they are string
/// @param value The number to convert
/// @return The number as a string with 7 decimal places
export const toStr = (value: number): string => {
    return (typeof value === 'string')
        ? parseFloat(value).toFixed(7).toString()
        : value.toFixed(7).toString();
}

/// @notice Gets the current Unix timestamp as a string
/// @return The current Unix timestamp as a string
export const now = (): string => {
    return moment().unix().toString();
}

/// @notice Converts a BigNumber to a decimal number with the specified
///         number of decimal places
/// @param amount The BigNumber to convert
/// @param precision The precision to use when converting
/// @param decimals The number of decimal places in the result
/// @return The BigNumber converted to a decimal number
export const bnToDecimal = (
    amount: BN,
    precision: number,
    decimals: number,
): number => {
    const scale = BN(10).pow(precision);
    const result = BN(amount).div(scale).toFixed(decimals);
    return parseFloat(result);
}

export const getNetworkIdbyDeploymentId = (
    deploymentId: string,
): NetworkId => {
    if (deploymentId === process.env.DEPLOYMENT_ID_ETH) {
        return NetworkId.MAINNET;
    } else if (deploymentId === process.env.DEPLOYMENT_ID_AVAX) {
        return NetworkId.AVALANCHE;
    } else {
        return NetworkId.UNKNOWN;
    }
}

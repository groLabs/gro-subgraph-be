import { IExposureItem } from './IExposureItem';

export interface IExposure {
    readonly 'stablecoins': IExposureItem[],
    readonly 'protocols': IExposureItem[],
}

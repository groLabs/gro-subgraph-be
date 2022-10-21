import { IExposureItem } from './IExposureItem';

export interface IExposure {
    'stablecoins': IExposureItem[],
    'protocols': IExposureItem[],
}

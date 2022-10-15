/// <reference types="react" />
import "chartjs-adapter-date-fns";
export declare type ChartProps = {
    colors?: {
        above?: string;
        below?: string;
        barChart?: string;
        tooltip?: string;
        tooltipDate?: string;
        tooltipTime?: string;
        tooltipData?: string;
        xLabel?: string;
        yLabel?: string;
        openLabel?: string;
        minChartLine?: string;
        minChartBackground?: string;
        slide?: string;
    };
    font?: string;
    dataset: {
        Date: string;
        Open: number;
        High?: number;
        Low?: number;
        Close?: number;
        "Adj Close"?: number;
        Volume: number;
    }[];
    currency?: string;
};
export declare const defaultColors: {
    above: string;
    below: string;
    barChart: string;
    tooltip: string;
    tooltipDate: string;
    tooltipTime: string;
    tooltipData: string;
    xLabel: string;
    yLabel: string;
    openLabel: string;
    minChartLine: string;
    minChartBackground: string;
    slide: string;
};
declare const Chart: ({ colors, font, dataset, currency, }: ChartProps) => JSX.Element;
export default Chart;

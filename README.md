The package that allows you to build financial charts styled your way. The chart functionality is similar to that on coinmarketcap.io.

## Installation

### npm

```
npm install financial-chart-made-simple
```

### yarn

```
yarn add financial-chart-made-simple
```

## Documentation

### Getting started

In order to create your own chart you need to import Chart component:

```js
import { Chart } from "financial-chart-made-simple";
```

Then you can use it as following:

```js
<Chart dataset={yourDataset} />
```

### Props

```js
 //your own dataset
dataset: {
   Date: string;
   Open: number;
   High?: number;
   Low?: number;
   Close?: number;
   "Adj Close"?: number;
   Volume: number;
 }[];
//colors object to customize the appearance of the chart
colors?: {
    above?: string; //default: 'rgb(106, 173, 56)'
    below?: string; //default: 'rgb(255, 63, 63)'
    barChart?: string; //default: '#ccc'
    tooltip?: string; //default: 'rgb(102, 102, 102)'
    tooltipDate?: string; //default: 'white'
    tooltipTime?: string; //default: 'lightgrey'
    tooltipData?: string; //default: 'lightgrey'
    xLabel?: string; //default: 'rgb(102, 102, 102)'
    yLabel?: string; //default: 'rgb(102, 102, 102)'
    openLabel?: string; //default: 'rgba(102, 102, 102, 0.7)'
    minChartLine?: string; //default: 'rgb(54, 162, 235)'
    minChartBackground?: string; //default: 'rgba(54, 162, 235, 0.2)'
    slide?: string; //default: 'rgba(54, 162, 235, 0.4)'
  };
  //font-family
  font?: string; //default: 'Arial'
  //currency; list of avaiable currencies and codes of them here: https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes
  currency?: string; //default: 'USD'
```

## License

financial-chart-made-simple is available under the [MIT license](http://opensource.org/licenses/MIT).

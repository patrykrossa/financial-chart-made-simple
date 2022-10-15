import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Chart from "./components/Chart/chart";
import { BTCPrices } from "./utils/btcPrices";
export const App = () => (React.createElement(ChakraProvider, { theme: theme },
    React.createElement(Chart, { dataset: BTCPrices })));

import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Container from "./components/Container/container";
import ChartPage from "./components/ChartPage/chartPage";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Container>
      <ChartPage />
    </Container>
  </ChakraProvider>
);

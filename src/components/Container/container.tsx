import { Flex } from "@chakra-ui/react";
import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      p="10vh 10vw"
      justifyContent="center"
      w="100vw"
      bgColor="rgb(29, 29, 29)"
    >
      {children}
    </Flex>
  );
};

export default Container;

import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import Chart from "../Chart/chart";

const ChartPage = () => {
  return (
    <Flex w="100%" flexDirection="column" gridGap="25px">
      <Flex color="white" fontSize="34px" fontWeight="600" mb="35px">
        Hashup Protocol&nbsp;<Text color="#FF3F3F">Charts</Text>
      </Flex>
      <Flex justifyContent="space-between" w="100%">
        {[...Array(5)].map((id) => (
          <Flex
            w="19%"
            borderRadius="4px"
            border="1px solid #4E4F52"
            bgColor="rgba(17, 17, 17, 0.3)"
            p="23px 13px"
            flexDirection="column"
            justifyContent="center"
            gridGap="10px"
            key={id}
          >
            <Text
              fontSize="14px"
              fontWeight="300"
              color="rgba(255, 255, 255, 0.5)"
            >
              Market Cap
            </Text>
            <Text fontSize="14px" fontWeight="300" color="rgba(255, 255, 255)">
              $2 mln
            </Text>
          </Flex>
        ))}
      </Flex>
      <Chart />
    </Flex>
  );
};

export default ChartPage;

import React from "react";
import { Flex, HStack, Button, Heading, Spacer } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex as="nav" m="5px">
      <Heading>The Image Converter App</Heading>
      <Spacer />
      <HStack spaceX="20px">
        <Button colorPalette="teal">pink colspan 2</Button>
        <Button colorPalette="purple">yellow colspan 2</Button>
      </HStack>
    </Flex>
  );
}

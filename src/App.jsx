import React from "react";
import { Grid, GridItem, Button } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Grid
      m="5px"
      p="5px"
      gap="4px"
      bg="gray.200"
      templateRows="repeat(7, 1fr)"
      minHeight="100vh"
    >
      <GridItem bg="green.400" rowSpan={1}>
        <Navbar />
      </GridItem>

      <GridItem bg="blue.400" rowSpan={6}>
        <Button colorPalette="teal">theme</Button>
      </GridItem>
    </Grid>
  );
}

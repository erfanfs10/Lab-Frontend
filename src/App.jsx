import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Convert from "./components/Convert";

export default function App() {
  return (
    <Grid
      p="10px"
      gap="4px"
      templateRows="repeat(7, 1fr)"
      minHeight="100vh"
    >
      <GridItem rowSpan={1}>
        <Navbar />
      </GridItem>

      <GridItem rowSpan={6}>
        <Convert/>
      </GridItem>
    </Grid>
  );
}

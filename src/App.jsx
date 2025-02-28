import React from "react";
import { Grid, GridItem, Button } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

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
        <Button colorPalette="teal">Main content</Button>
      </GridItem>
    </Grid>
  );
}

import {useState} from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Convert from "./components/Convert";

export default function App() {
    const [wsStatus, setWsStatus] = useState(false);
  
  return (
    <Grid
      p="10px"
      gap="4px"
      templateRows="repeat(10, 1fr)"
      minHeight="100vh"
    >
      <GridItem rowSpan={1}>
        <Navbar wsStatus={wsStatus} />
      </GridItem>

      <GridItem rowSpan={9}>
        <Convert wsStatus={wsStatus} setWsStatus={setWsStatus}/>
      </GridItem>
    </Grid>
  );
}

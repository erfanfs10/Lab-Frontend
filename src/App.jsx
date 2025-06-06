import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Convert from "./components/Convert";

export default function App() {
  const [wsStatus, setWsStatus] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "eng");

  useEffect(() => {
    if (lang === "fa") {
      document.body.classList.add("farsi");
    } else {
      document.body.classList.remove("farsi");
    }
  }, [lang]);

  return (
    <Grid
      bg={{ base: "white", _dark: "bg.info" }}
      p="10px"
      gap="4px"
      templateRows="repeat(10, 1fr)"
      minHeight="100vh"
    >
      <GridItem rowSpan={1}>
        <Navbar wsStatus={wsStatus} setLang={setLang} lang={lang} />
      </GridItem>

      <GridItem rowSpan={9}>
        <Convert wsStatus={wsStatus} setWsStatus={setWsStatus} lang={lang} />
      </GridItem>
    </Grid>
  );
}

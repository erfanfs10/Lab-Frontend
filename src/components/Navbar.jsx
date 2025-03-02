import { useState } from "react";
import {
  Flex,
  HStack,
  Heading,
  Spacer,
  LocaleProvider,
  Separator,
  Status,
} from "@chakra-ui/react";
import ColorModeButton from "./ColorMode";
import SelectLanguage from "./SelectLanguage";

export default function Navbar({ wsStatus }) {
  const [lang, setLang] = useState("eng");

  return (
    <>
      <LocaleProvider locale="ar-Ar">
        <Flex as="nav" m="10px" dir={lang === "fa" ? "rtl" : ""}>
          <Heading ml="20px">
            {lang === "fa" ? "برنامه کانورت عکس" : "The Image Converter App"}
          </Heading>
          <Spacer />
          <HStack mr="20px" spaceX="20px">
            <Status.Root size="lg" colorPalette={wsStatus ? "green" : "red"}>
              <Status.Indicator />
              {wsStatus
                ? lang === "fa"
                  ? "متصل شد"
                  : "Connected"
                : lang === "fa"
                ? "در حال اتصال"
                : "Connecting"}
            </Status.Root>
            <SelectLanguage onSetLang={(val) => setLang(val)} />
            <ColorModeButton />
          </HStack>
        </Flex>
      </LocaleProvider>
      <Separator size="md" />
    </>
  );
}

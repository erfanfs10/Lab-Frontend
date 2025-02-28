import { useState } from "react";
import {
  Flex,
  HStack,
  Button,
  Heading,
  Spacer,
  LocaleProvider,
} from "@chakra-ui/react";
import ColorModeButton from "./ColorMode";
import SelectLanguage from "./SelectLanguage";

export default function Navbar() {
  const [lang, setLang] = useState("eng");

  return (
    <LocaleProvider locale="ar-Ar">
      <Flex as="nav" m="20px" dir={lang==="fa"?"rtl":""} >
        <Heading>The Image Converter App</Heading>
        <Spacer />
        <HStack spaceX="20px">
          <SelectLanguage onSetLang={(val)=>setLang(val)} />
          <ColorModeButton />
        </HStack>
      </Flex>
    </LocaleProvider>
  );
}

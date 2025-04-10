import { Flex, HStack, Separator } from "@chakra-ui/react";
import CustomMenu from "./CustomMenu";
import Header from "./Header";
import CustomStatus from "./CustomStatus";
import ColorModeButton from "./ColorMode";
import SelectLanguage from "./SelectLanguage";

export default function Navbar({ wsStatus, setLang, lang }) {
  return (
    <>
      <Flex
        as="nav"
        m="10px"
        dir={lang === "fa" ? "rtl" : "ltl"}
        justifyContent="space-between"
        alignItems="center"
      >
        <Header lang={lang} />
        <HStack spaceX="20px">
          <CustomStatus wsStatus={wsStatus} lang={lang} hideBelow="md" />
          <SelectLanguage setLang={setLang} lang={lang} hideBelow="md" />
          <ColorModeButton hideBelow="md" />
          <CustomMenu
            setLang={setLang}
            lang={lang}
            wsStatus={wsStatus}
            hideBelow="md"
          />
        </HStack>
      </Flex>
      <Separator size="md" />
    </>
  );
}

import { Menu, Portal, IconButton, Text, Box } from "@chakra-ui/react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useColorMode } from "./ui/color-mode";
import CustomStatus from "./CustomStatus";
import SelectLanguage from "./SelectLanguage";
import { VscColorMode } from "react-icons/vsc";

export default function CustomMenu({ setLang, lang, wsStatus, hideBelow }) {
  const { toggleColorMode } = useColorMode();

  return (
    <Box hideFrom={hideBelow}>
      <Menu.Root
        closeOnSelect={false}
        onSelect={(e) => {
          if (e.value === "mode") {
            toggleColorMode();
          }
        }}
      >
        <Menu.Trigger asChild>
          <IconButton
            variant="outline"
            size={{
              base: "sm",
              sm: "sm",
              md: "sm",
              lg: "sm",
              xl: "sm",
            }}
          >
            <IoMdArrowDropdown />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="status">
                <CustomStatus wsStatus={wsStatus} lang={lang} />
              </Menu.Item>
              <Menu.Item value="mode">
                <VscColorMode />
                <Text
                  textStyle={{
                    base: "sm",
                    sm: "sm",
                    md: "md",
                    lg: "md",
                    xl: "md",
                  }}
                >
                  {lang === "eng" ? "Color Mode" : "حالت رنگ"}
                </Text>
              </Menu.Item>
              <Menu.Item value="lang">
                <SelectLanguage setLang={setLang} lang={lang} />
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
}

import { NativeSelect, HStack, Icon } from "@chakra-ui/react";
import { IoLanguage } from "react-icons/io5";

export default function SelectLanguage({ setLang, lang, hideBelow }) {
  return (
    <>
      <HStack hideBelow={hideBelow}>
        <Icon
          size={{
            base: "sm",
            sm: "sm",
            md: "md",
            lg: "md",
            xl: "md",
          }}
        >
          <IoLanguage />
        </Icon>
        <NativeSelect.Root
          size={{
            base: "sm",
            sm: "sm",
            md: "md",
            lg: "md",
            xl: "md",
          }}
        >
          <NativeSelect.Field
            placeholder={lang === "eng" ? "Select Language" : "انتخاب زبان"}
            onChange={(e) => {
              if (e.currentTarget.value) {
                setLang(e.currentTarget.value);
                localStorage.setItem("lang", e.currentTarget.value);
              }
              return;
            }}
          >
            <option value="eng">English</option>
            <option value="fa">Farsi</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </HStack>
    </>
  );
}

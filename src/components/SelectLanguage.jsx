import { NativeSelect, HStack, Icon } from "@chakra-ui/react";
import { IoLanguage } from "react-icons/io5";

export default function SelectLanguage({onSetLang}) {
  return (
    <>
      <HStack>
        <Icon fontSize="25px">
          <IoLanguage />
        </Icon>
        <NativeSelect.Root size="md">
          <NativeSelect.Field onChange={(e) => onSetLang(e.currentTarget.value)}>
            <option value="eng">English</option>
            <option value="fa">Farsi</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </HStack>
    </>
  );
}

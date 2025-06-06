import { Text } from "@chakra-ui/react";

export default function Header({ lang }) {
  return (
    <>
      <Text
        textStyle={{
          base: "md",
          sm: "md",
          md: "lg",
          lg: "xl",
          xl: "xl",
        }}
      >
        {lang === "fa" ? "ابزار کانورت سریع عکس" : "Fast Image Converter Tool"}
      </Text>
    </>
  );
}

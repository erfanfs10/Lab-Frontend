import { Heading } from "@chakra-ui/react";

export default function Header({ lang }) {
  return (
    <>
      <Heading
        textStyle={{
          base: "sm",
          sm: "sm",
          md: "md",
          lg: "lg",
          xl: "lg",
        }}
        as="h1"
      >
        {lang === "fa" ? "ابزار کانورت سریع عکس" : "Fast Image Converter Tool"}
      </Heading>
    </>
  );
}

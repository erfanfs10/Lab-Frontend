import { Button, Text } from "@chakra-ui/react";

export default function UploadButton({lang, onUploadFile}) {
  return (
    <>
      <Button
        size={{
          base: "sm",
          sm: "sm",
          md: "md",
          lg: "md",
          xl: "md",
        }}
        mt="15px"
        onClick={onUploadFile}
      >
        <Text
          textStyle={{
            base: "sm",
            sm: "sm",
            md: "md",
            lg: "md",
            xl: "md",
          }}
          fontWeight="semibold"
        >
          {lang === "eng" ? "Upload & Convert" : "آپلود و کانورت"}
        </Text>
      </Button>
    </>
  );
}

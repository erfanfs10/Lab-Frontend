import { Status, Box } from "@chakra-ui/react";

export default function CustomStatus({ wsStatus, lang, hideBelow }) {
  return (
    <>
      <Box hideBelow={hideBelow}>
        <Status.Root
          size={{
            base: "md",
            sm: "md",
            md: "md",
            lg: "lg",
            xl: "lg",
          }}
          colorPalette={wsStatus ? "green" : "red"}
        >
          <Status.Indicator />
          {wsStatus
            ? lang === "fa"
              ? "متصل شد"
              : "Connected"
            : lang === "fa"
            ? "در حال اتصال"
            : "Connecting"}
        </Status.Root>
      </Box>
    </>
  );
}

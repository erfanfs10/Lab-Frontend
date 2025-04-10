import { Button, Box } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { VscColorMode } from "react-icons/vsc";

export default function ColorModeButton({ hideBelow }) {
  const { toggleColorMode } = useColorMode();
  return (
    <Box hideBelow={hideBelow}>
      <Button
        size={{
          base: "sm",
          sm: "sm",
          md: "md",
          lg: "md",
          xl: "md",
        }}
        variant="outline"
        onClick={toggleColorMode}
      >
        <VscColorMode />
      </Button>
    </Box>
  );
}

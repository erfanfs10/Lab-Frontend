import { Button } from "@chakra-ui/react"
import { useColorMode } from "./ui/color-mode"
import { VscColorMode } from "react-icons/vsc";

export default function ColorModeButton () {
  const { toggleColorMode } = useColorMode()
  return (
    <Button variant="outline" onClick={toggleColorMode}>
      <VscColorMode/>
    </Button>
  )
}

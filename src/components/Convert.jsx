import { useState, useRef, useEffect } from "react";
import {
  VStack,
  Text,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
  FileUploadClearTrigger,
} from "./ui/file-upload";
import { toaster } from "./ui/toaster";
import { CloseButton } from "./ui/close-button";
import { InputGroup } from "./ui/input-group";
import { StepsItem, StepsList, StepsRoot } from "./ui/steps";
import {
  ClipboardIconButton,
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
} from "./ui/clipboard";
import { Radio, RadioGroup } from "./ui/radio";
import axios from "axios";

export default function Convert({ setWsStatus, wsStatus }) {
  const selectedFile = useRef(null);
  const [outPutFormat, setOutPutFormat] = useState(".png");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");

  const showToast = (errorText, toastType) => {
    toaster.create({
      title: errorText,
      type: toastType,
    });
  };

  const connectToWS = () => {
    // Open WebSocket connection
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/");

    // runs when ws connected
    ws.onopen = () => {
      console.log("WebSocket connected");
      setWsStatus(true);
    };

    // runs when receive a message
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStep(data.step);
      console.log(data.step);
      if (data.status === "Done" && data.url) {
        setDownloadUrl(data.url);
      }
    };

    // runs when there is an error
    ws.onerror = (error) => {
      showToast("Can Not Connect To Server", "error");
      console.log("Can not connect to Websocket:", error);
      setWsStatus(false);
    };

    // runs when ws get closed
    ws.onclose = () => {
      console.log("WebSocket closed");
      setWsStatus(false);
    };
  };

  useEffect(() => {
    if (!wsStatus) {
      connectToWS();
    }
    let interval = setInterval(() => {
      if (!wsStatus) {
        connectToWS();
      }
    }, 3000); // each 3 second
    return () => clearInterval(interval);
  }, [wsStatus]);

  const uploadFile = (e) => {
    e.preventDefault();
    const f = selectedFile.current.files[0];
    if (!f) {
      showToast("Please Select A File", "error");
      return;
    }
    if (!Boolean(f.type.match("image.*"))) {
      showToast("The File Is Not An Image", "error");
      return;
    }
    if (f.size >= 5000000) {
      showToast("The File Is Too Large", "error");
      return;
    }
    if (outPutFormat == "") {
      showToast("Please Select Your Output Format", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", f);
    axios
      .post(
        `http://127.0.0.1:8000/convert/?format=${outPutFormat}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            let percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          },
        }
      )
      .then((res) => {
        console.log("success")
      })
      .catch((err) => {
        showToast(err.response.data.message, "error")
      });
  };

  return (
    <>
      <VStack justifyContent="center" alignItems="center">

        <Text textStyle="xl" fontWeight="semibold">
          Fast Image Converter Tool
        </Text>

        <FileUploadRoot
          ref={selectedFile}
          maxW="xl"
          alignItems="stretch"
          maxFiles={1}
        >
          <FileUploadDropzone
            label="Drag and drop here to upload"
            description="png, jpeg, webp up to 5MB"
          />
          <InputGroup
            endElement={
              <FileUploadClearTrigger asChild>
                <CloseButton
                  me="-1"
                  size="xs"
                  variant="plain"
                  focusVisibleRing="inside"
                  focusRingWidth="2px"
                  pointerEvents="auto"
                  color="fg.subtle"
                />
              </FileUploadClearTrigger>
            }
          >
            <FileUploadList required />
          </InputGroup>
        </FileUploadRoot>

        <Text mb="5px" textStyle="lg">
          Select your output format
        </Text>

        <RadioGroup mt="5px" size="lg" value={outPutFormat} onValueChange={(e) => setOutPutFormat(e.value)}>
          <HStack gap="6">
            <Radio value=".png">.png</Radio>
            <Radio value=".jpeg">.jpeg</Radio>
            <Radio value=".webp">.webp</Radio>
          </HStack>
        </RadioGroup>

        <Button mt="10px" onClick={uploadFile}>
          Upload & Convert
        </Button>

        <Box mt="10px" width="700px">
          <StepsRoot defaultStep={0} step={step} count={3}>
            <StepsList>
              <StepsItem
                index={0}
                title="Uploading"
                description={progress === 0 ? "" : progress + "%"}
              />
              <StepsItem index={1} title="Converting" />
              <StepsItem index={2} title="Ready" />
            </StepsList>
          </StepsRoot>
        </Box>

        <Box className="mt-4 p-4 bg-white shadow rounded">
          {downloadUrl && (
            <ClipboardRoot
              mb="20px"
              maxW="300px"
              value={downloadUrl}
              timeout={1000}
            >
              <ClipboardLabel>Download Link</ClipboardLabel>
              <InputGroup
                width="full"
                endElement={<ClipboardIconButton me="-2" />}
              >
                <ClipboardInput />
              </InputGroup>
            </ClipboardRoot>
          )}
        </Box>
      </VStack>
    </>
  );
}

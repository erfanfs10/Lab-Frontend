import { useState, useRef, useEffect } from "react";
import {
  VStack,
  Text,
  Button,
  Box,
  HStack,
  ProgressCircle,
  AbsoluteCenter,
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
import {
  ClipboardIconButton,
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
} from "./ui/clipboard";
import { Radio, RadioGroup } from "./ui/radio";
import axios from "axios";

export default function Convert({ setWsStatus, wsStatus, lang }) {
  const selectedFile = useRef(null);
  const [outPutFormat, setOutPutFormat] = useState(".png");
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  // Create Status Translate Map
  const statusTranslate = new Map([
    ["Uploading", "در حال آپلود"],
    ["Converting", "در حال کانورت"],
    ["Done", "انجام شد"],
  ]);

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
      setProgress(data.progress);
      setStatus(data.status);
      if (data.status === "Done") {
        setDownloadUrl(data.url);
      }
    };

    // runs when there is an error
    ws.onerror = (error) => {
      showToast(
        lang === "fa" ? "خطا در اتصال به سرور" : "Can Not Connect To Server",
        "error"
      );
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
      showToast(
        lang === "fa" ? "لطفا فایل خود را انتخاب کنید" : "Please Select A File",
        "error"
      );
      return;
    }
    if (!Boolean(f.type.match("image.*"))) {
      showToast(
        lang === "fa" ? "فایل انتخاب شده عکس نیست" : "The File Is Not An Image",
        "error"
      );
      return;
    }
    if (f.size >= 5000000) {
      showToast(
        lang === "fa" ? "حجم فایل بیش از حد مجاز است" : "The File Is Too Large",
        "error"
      );
      return;
    }
    if (outPutFormat == "") {
      showToast(
        lang === "fa"
          ? "لطفا خروجی فایل خود را انتخاب کنید"
          : "Please Select Your Output Format",
        "error"
      );
      return;
    }
    if ("." + f.name.split(".")[1] === outPutFormat) {
      showToast(
        lang === "fa"
          ? "فرمت خروجی و فایل انتخاب شده یکسان است"
          : "Output Format And Selected File Format Are The Same",
        "error"
      );
      return;
    }
    const formData = new FormData();
    formData.append("image", f);
    axios
      .post(`http://127.0.0.1:8000/convert/?format=${outPutFormat}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // onUploadProgress: (event) => {
        //   let percent = Math.round((event.loaded * 100) / event.total);
        //   setProgress(percent);
        // },
      })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        showToast(err.response.data.message, "error");
      });
  };

  return (
    <>
      <VStack justifyContent="center" alignItems="center">
        <FileUploadRoot
          ref={selectedFile}
          maxW="xl"
          alignItems="stretch"
          maxFiles={1}
        >
          <FileUploadDropzone
            label={
              lang === "eng"
                ? "Drag and drop or click here to upload"
                : "بکشید یا کلیک کنید"
            }
            description={
              lang === "eng"
                ? "png, jpeg, webp up to 5MB"
                : "png, jpeg, webp حداکثر ۵ مگابایت"
            }
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

        <Text
          mb="5px"
          textStyle={{
            base: "md",
            sm: "md",
            md: "md",
            lg: "lg",
            xl: "lg",
          }}
          fontWeight="medium"
        >
          {lang === "eng"
            ? "Select Your Output Format"
            : "فرمت خروجی را انتخاب کنید"}
        </Text>
        <RadioGroup
          mt="5px"
          size={{
            base: "sm",
            sm: "sm",
            md: "md",
            lg: "lg",
            xl: "lg",
          }}
          value={outPutFormat}
          onValueChange={(e) => setOutPutFormat(e.value)}
        >
          <HStack gap="4">
            <Radio value=".png">
              <Text fontWeight="medium" textStyle="lg">
                .png
              </Text>
            </Radio>
            <Radio value=".jpeg">
              <Text fontWeight="medium" textStyle="lg">
                .jpeg
              </Text>
            </Radio>
            <Radio value=".webp">
              <Text fontWeight="medium" textStyle="lg">
                .webp
              </Text>
            </Radio>
          </HStack>
        </RadioGroup>

        <Button
          size={{
            base: "sm",
            sm: "sm",
            md: "md",
            lg: "md",
            xl: "md",
          }}
          mt="15px"
          onClick={uploadFile}
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

        <Box>
          {progress && (
            <HStack justifyContent="center" alignItems="center" mt="15px">
              <ProgressCircle.Root
                textStyle={{
                  base: "md",
                  sm: "md",
                  md: "md",
                  lg: "lg",
                  xl: "lg",
                }}
                value={progress}
              >
                <ProgressCircle.Circle
                  css={{
                    "--thickness": {
                      base: "2px",
                      sm: "2px",
                      md: "3px",
                      lg: "3px",
                      xl: "3px",
                    },
                  }}
                >
                  <ProgressCircle.Track />
                  <ProgressCircle.Range />
                </ProgressCircle.Circle>
                <AbsoluteCenter>
                  <ProgressCircle.ValueText />
                </AbsoluteCenter>
              </ProgressCircle.Root>
              <Text
                textStyle={{
                  base: "sm",
                  sm: "sm",
                  md: "md",
                  lg: "lg",
                  xl: "lg",
                }}
              >
                {lang === "eng" ? status : statusTranslate.get(status)}
              </Text>
            </HStack>
          )}
        </Box>

        {downloadUrl && (
          <>
            <ClipboardRoot
              mb="20px"
              maxW="300px"
              value={downloadUrl}
              timeout={1000}
              dir={lang === "fa" ? "rtl" : "ltl"}
            >
              <ClipboardLabel
                ttextStyle={{
                  base: "md",
                  sm: "md",
                  md: "md",
                  lg: "lg",
                  xl: "lg",
                }}
              >
                {lang === "eng" ? "Download Link" : "لینک دانلود"}
              </ClipboardLabel>
              <InputGroup
                width="full"
                endElement={<ClipboardIconButton me="-2" />}
              >
                <ClipboardInput />
              </InputGroup>
            </ClipboardRoot>
            {/* <a href={downloadUrl}>download</a> */}
          </>
        )}
      </VStack>
    </>
  );
}

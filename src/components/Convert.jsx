import { useState, useRef, useEffect } from "react";
import {
  VStack,
  Text,
  Box,
  HStack,
  ProgressCircle,
  AbsoluteCenter,
  Clipboard,
  InputGroup,
  Input,
  IconButton,
  FileUpload,
  Icon,
  RadioGroup,
} from "@chakra-ui/react";
import UploadButton from "./UploadButton";
import { toaster } from "./ui/toaster";
import { LuUpload } from "react-icons/lu";
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
      <VStack
        justifyContent="center"
        alignItems="center"
      >
        <FileUpload.Root mt="2px" maxW="xl" alignItems="stretch" maxFiles={1}>
          <FileUpload.HiddenInput ref={selectedFile} />
          <FileUpload.Dropzone>
            <Icon size="md">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>
                {lang === "eng"
                  ? "Drag and drop or click here to upload"
                  : "بکشید یا کلیک کنید"}
              </Box>
              <Box>
                {lang === "eng"
                  ? "png, jpeg, webp up to 5MB"
                  : "png, jpeg, webp حداکثر ۵ مگابایت"}
              </Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger />
                  </FileUpload.Item>
                ))
              }
            </FileUpload.Context>
          </FileUpload.ItemGroup>
        </FileUpload.Root>

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

        <RadioGroup.Root
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
            <RadioGroup.Item value=".png">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>.png</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value=".jpeg">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>.jpeg</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value=".webp">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>.webp</RadioGroup.ItemText>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>

        <UploadButton lang={lang} onUploadFile={uploadFile} />

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
            <Clipboard.Root
              mt="5px"
              maxW="300px"
              value={downloadUrl}
              timeout={1000}
              dir={lang === "fa" ? "rtl" : "ltl"}
            >
              <Clipboard.Label
                textStyle={{
                  base: "sm",
                  sm: "sm",
                  md: "md",
                  lg: "md",
                  xl: "md",
                }}
              >
                {lang === "eng" ? "Download Link" : "لینک دانلود"}
              </Clipboard.Label>
              <InputGroup
                endElement={
                  <>
                    <Clipboard.Trigger asChild>
                      <IconButton variant="surface" size="xs" me="-2">
                        <Clipboard.Indicator />
                      </IconButton>
                    </Clipboard.Trigger>
                  </>
                }
              >
                <Clipboard.Input asChild>
                  <Input />
                </Clipboard.Input>
              </InputGroup>
            </Clipboard.Root>
          </>
        )}
      </VStack>
    </>
  );
}

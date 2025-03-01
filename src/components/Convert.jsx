import { useState, useRef, useEffect } from "react";
import { VStack, Text, Button, NativeSelect, Box } from "@chakra-ui/react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "./ui/file-upload";
import { toaster } from "./ui/toaster";
import axios from "axios";

export default function Convert() {
  const selectedFile = useRef(null);
  const outPutFormat = useRef(null);
  const [wsStatus, setWsStatus] = useState(false);
  const [err, setErr] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const showToast = (errorText, toastType) => {
    toaster.create({
      title: errorText,
      type: toastType,
    });
  };

  useEffect(() => {
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
      setStatus(data.status);
      if (data.status === "Done" && data.url) {
        setDownloadUrl(data.url);
      }
    };

    // runs when there is an error
    ws.onerror = (error) => {
      showToast("Can Not Connect To Server Please Reload The Page", "error");
      console.log("Can not connect to Websocket:", error);
      setWsStatus(false);
    };

    // runs when ws get closed
    ws.onclose = () => {
      console.log("WebSocket closed");
      setWsStatus(false);
    };
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
    if (outPutFormat.current.value == "") {
      showToast("Please Select Your Output Format", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", f);
    axios
      .post(
        `http://127.0.0.1:8000/convert/?format=${outPutFormat.current.value}`,
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
        setErr(null);
      })
      .catch((err) => {
        setErr(err.response.data.message);
      });
  };

  return (
    <>
      <VStack justifyContent="center">
        {err && showToast(err, "error")}
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
          <FileUploadList required />
        </FileUploadRoot>
        <Button onClick={uploadFile}>Upload & Convert</Button>

        <Text>Select your output format</Text>

        <NativeSelect.Root size="sm" width="240px">
          <NativeSelect.Field ref={outPutFormat} placeholder="Select option">
            <option value=".webp">.webp</option>
            <option value=".png">.png</option>
            <option value=".jpeg">.jpeg</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {status && (
          <Box className="mt-4 p-4 bg-white shadow rounded">
            <Text>Status: {status}</Text>
            {progress > 0 && <Text>Upload Progress: {progress}%</Text>}
            {downloadUrl && (
              <a href={downloadUrl} download className="text-green-500">
                Download Converted File: {downloadUrl}
              </a>
            )}
          </Box>
        )}
      </VStack>
    </>
  );
}

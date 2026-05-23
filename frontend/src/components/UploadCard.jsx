import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import API from "../services/api";
import { conversionMap } from "../constants/conversionMap";
import { fileAcceptMap } from "../constants/FileAcceptMap";

import FilePicker from "./FilePicker";
import ConversionSelect from "./ConversionSelect";
import SplitPdfSelector from "./SplitPdfSelector";
import ConvertButton from "./ConvertButton";
import usePdfThumbnails from "../hooks/usePdfThumbnails";


export default function UploadCard({
  defaultConversion
}) {
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const [selectedPages, setSelectedPages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [conversionType, setConversionType] =
    useState(
      defaultConversion || "WORD_TO_PDF"
    );

  const {
    thumbnails,
    setThumbnails,
    generateThumbnails
  } = usePdfThumbnails();

  useEffect(() => {
    if (defaultConversion) {
      setConversionType(defaultConversion);
    }
  }, [defaultConversion]);

  useEffect(() => {
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedPages([]);
    setThumbnails([]);
  }, [conversionType]);

  const handleFileChange =
    async (e) => {
      const files =
        Array.from(e.target.files);

      if (
        conversionType === "MERGE_PDF"
      ) {
        setSelectedFiles(files);
        return;
      }

      const file = files[0];
      setSelectedFile(file);

      if (
        conversionType === "SPLIT_PDF" ||
        conversionType === "PDF_TO_JPG"
      ) {
        await generateThumbnails(file);
      }
    };

  const handleConvert =
    async () => {
      if (
        !selectedFile &&
        !selectedFiles.length
      ) {
        toast.error("Please select a file");
        return;
      }

      if (
        (conversionType === "PDF_TO_JPG" ||
          conversionType === "SPLIT_PDF") &&
        !selectedPages.length
      ) {
        toast.error("Please select at least one page");
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();

        if (conversionType === "MERGE_PDF") {
          selectedFiles.forEach(
            (f) => formData.append("files", f)
          );
        } else {
          formData.append("file", selectedFile);
        }

        const config = {
          responseType: "blob"
        };

        if (
          conversionType === "SPLIT_PDF" &&
          selectedPages.length
        ) {
          config.params = {
            pages: selectedPages.join(",")
          };
        }

        if (conversionType === "PDF_TO_JPG") {
          for (const page of selectedPages) {
            const pageConfig = {
              responseType: "blob",
              params: { page }
            };

            const response = await API.post(
              conversionMap[conversionType].endpoint,
              formData,
              pageConfig
            );

            const blob = new Blob(
              [response.data],
              { type: conversionMap[conversionType].mimeType }
            );

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `page_${page}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          }

          toast.success("Conversion successful 🦋");
          setLoading(false);
          return;
        }

        const response = await API.post(
          conversionMap[conversionType].endpoint,
          formData,
          config
        );

        const blob = new Blob(
          [response.data],
          { type: conversionMap[conversionType].mimeType }
        );

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `output${conversionMap[conversionType].outputExtension}`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Conversion successful 🦋");

      } catch {
        toast.error("Conversion failed");
      } finally {
        setLoading(false);
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        max-w-3xl
        mx-auto
        mt-20
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-10
      "
    >
      <Toaster position="top-right" />

      <FilePicker
        conversionType={conversionType}
        fileAcceptMap={fileAcceptMap}
        selectedFile={selectedFile}
        selectedFiles={selectedFiles}
        onChange={handleFileChange}
      />

      <ConversionSelect
        conversionType={conversionType}
        setConversionType={setConversionType}
      />

      {(conversionType === "SPLIT_PDF" ||
        conversionType === "PDF_TO_JPG") && (
        <SplitPdfSelector
          thumbnails={thumbnails}
          selectedPages={selectedPages}
          setSelectedPages={setSelectedPages}
        />
      )}

      <ConvertButton
        loading={loading}
        onClick={handleConvert}
      />
    </motion.div>
  );
}
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

const PAGE_PICKER_TYPES = ["SPLIT_PDF", "PDF_TO_JPG", "PDF_TO_PNG"];

export default function UploadCard({ defaultConversion }) {
  const [selectedFile,    setSelectedFile]   = useState(null);
  const [selectedFiles,   setSelectedFiles]  = useState([]);
  const [selectedPages,   setSelectedPages]  = useState([]);
  const [loading,         setLoading]        = useState(false);
  const [conversionType,  setConversionType] = useState(defaultConversion || "WORD_TO_PDF");
  const [imagePreviews,   setImagePreviews]  = useState([]); // [{name, url}]

  const { thumbnails, setThumbnails, generateThumbnails } = usePdfThumbnails();

  useEffect(() => {
    if (defaultConversion) setConversionType(defaultConversion);
  }, [defaultConversion]);

  useEffect(() => {
    // revoke old object URLs to avoid memory leaks
    imagePreviews.forEach(p => URL.revokeObjectURL(p.url));
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedPages([]);
    setThumbnails([]);
    setImagePreviews([]);
  }, [conversionType]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (conversionType === "MERGE_PDF") {
      setSelectedFiles(files);
      return;
    }

    if (conversionType === "MERGE_IMAGES_TO_PDF") {
      setSelectedFiles(files);
      const previews = files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setImagePreviews(previews);
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    if (PAGE_PICKER_TYPES.includes(conversionType)) {
      await generateThumbnails(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile && !selectedFiles.length) {
      toast.error("Please select a file");
      return;
    }

    if (PAGE_PICKER_TYPES.includes(conversionType) && !selectedPages.length) {
      toast.error("Please select at least one page");
      return;
    }

    try {
      setLoading(true);

      // ── MERGE IMAGES TO PDF ─────────────────────────────────────────
      if (conversionType === "MERGE_IMAGES_TO_PDF") {
        const fd = new FormData();
        selectedFiles.forEach((f) => fd.append("files", f));
        const res = await API.post(
          conversionMap["MERGE_IMAGES_TO_PDF"].endpoint,
          fd,
          { responseType: "blob" }
        );
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "merged_images.pdf";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Conversion successful 🦋");
        setLoading(false);
        return;
      }

      // ── PDF_TO_JPG / PDF_TO_PNG — per-page download ─────────────────
      if (conversionType === "PDF_TO_JPG" || conversionType === "PDF_TO_PNG") {
        const ext = conversionType === "PDF_TO_JPG" ? "jpg" : "png";
        const formData = new FormData();
        formData.append("file", selectedFile);
        for (const page of selectedPages) {
          const res = await API.post(
            conversionMap[conversionType].endpoint,
            formData,
            { responseType: "blob", params: { page } }
          );
          const blob = new Blob([res.data], { type: conversionMap[conversionType].mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `page_${page}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
        }
        toast.success("Conversion successful 🦋");
        setLoading(false);
        return;
      }

      // ── Everything else ─────────────────────────────────────────────
      const formData = new FormData();

      if (conversionType === "MERGE_PDF") {
        selectedFiles.forEach((f) => formData.append("files", f));
      } else {
        formData.append("file", selectedFile);
      }

      const config = { responseType: "blob" };

      if (conversionType === "SPLIT_PDF" && selectedPages.length) {
        config.params = { pages: selectedPages.join(",") };
      }

      const response = await API.post(
        conversionMap[conversionType].endpoint,
        formData,
        config
      );

      const blob = new Blob([response.data], { type: conversionMap[conversionType].mimeType });
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
      className="max-w-3xl mx-auto mt-20 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10"
    >
      <Toaster position="top-right" />

      <FilePicker
        conversionType={conversionType}
        fileAcceptMap={fileAcceptMap}
        selectedFile={selectedFile}
        selectedFiles={selectedFiles}
        onChange={handleFileChange}
      />

      {/* Image previews for MERGE_IMAGES_TO_PDF */}
      {conversionType === "MERGE_IMAGES_TO_PDF" && imagePreviews.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-3">
            {imagePreviews.length} image{imagePreviews.length > 1 ? "s" : ""} selected — will be merged in this order
          </p>
          <div className="grid grid-cols-4 gap-3">
            {imagePreviews.map((preview, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-white/10 bg-white/5"
              >
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full object-cover"
                  style={{ height: "80px" }}
                />
                <p className="text-xs text-gray-500 text-center py-1 px-1 truncate">
                  {i + 1}. {preview.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(conversionType === "PDF_TO_JPG" || conversionType === "PDF_TO_PNG") && (
        <p className="mt-4 text-xs text-yellow-400/80 text-center">
          ℹ️ Each selected page will be downloaded as a separate image file
        </p>
      )}

      <ConversionSelect
        conversionType={conversionType}
        setConversionType={setConversionType}
      />

      {PAGE_PICKER_TYPES.includes(conversionType) && (
        <SplitPdfSelector
          thumbnails={thumbnails}
          selectedPages={selectedPages}
          setSelectedPages={setSelectedPages}
        />
      )}

      <ConvertButton loading={loading} onClick={handleConvert} />
    </motion.div>
  );
}
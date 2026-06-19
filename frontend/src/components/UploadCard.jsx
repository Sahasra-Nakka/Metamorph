import { useState, useEffect, useRef } from "react";
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
  const [selectedFile,   setSelectedFile]  = useState(null);
  const [selectedFiles,  setSelectedFiles] = useState([]);
  const [selectedPages,  setSelectedPages] = useState([]);
  const [loading,        setLoading]       = useState(false);
  const [conversionType, setConversionType] = useState(defaultConversion || "WORD_TO_PDF");
  const [imagePreviews,  setImagePreviews] = useState([]);
  const [outputName,     setOutputName]    = useState("");
  const [nameEditedByUser, setNameEditedByUser] = useState(false);

  const { thumbnails, setThumbnails, generateThumbnails, truncated } = usePdfThumbnails();

  // Track current previews in a ref so the unmount cleanup always sees the latest list
  const imagePreviewsRef = useRef(imagePreviews);
  useEffect(() => { imagePreviewsRef.current = imagePreviews; }, [imagePreviews]);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviewsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  useEffect(() => {
    if (defaultConversion) setConversionType(defaultConversion);
  }, [defaultConversion]);

  // Reset state and revoke URLs when conversion type changes
  useEffect(() => {
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setSelectedFile(null);
    setSelectedFiles([]);
    setSelectedPages([]);
    setThumbnails([]);
    setImagePreviews([]);
    setOutputName("");
    setNameEditedByUser(false);
  }, [conversionType]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (conversionType === "MERGE_PDF") {
      setSelectedFiles(files);
      if (!nameEditedByUser) setOutputName("merged");
      return;
    }

    if (conversionType === "MERGE_IMAGES_TO_PDF") {
      setSelectedFiles(files);
      const previews = files.map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setImagePreviews(previews);
      if (!nameEditedByUser) setOutputName("merged_images");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    if (!nameEditedByUser) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setOutputName(baseName);
    }

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

    const baseName = sanitizeFilename(outputName) || "converted_file";

    try {
      setLoading(true);

      // ── MERGE IMAGES TO PDF ──────────────────────────────────────────
      if (conversionType === "MERGE_IMAGES_TO_PDF") {
        const fd = new FormData();
        selectedFiles.forEach((f) => fd.append("files", f));
        const res = await API.post(
          conversionMap["MERGE_IMAGES_TO_PDF"].endpoint,
          fd,
          { responseType: "blob" }
        );
        triggerDownload(res.data, `${baseName}.pdf`, "application/pdf");
        toast.success("Conversion successful 🦋");
        return;
      }

      // ── PDF_TO_JPG / PDF_TO_PNG — per-page download ──────────────────
      if (conversionType === "PDF_TO_JPG" || conversionType === "PDF_TO_PNG") {
        const ext = conversionType === "PDF_TO_JPG" ? "jpg" : "png";
        const formData = new FormData();
        formData.append("file", selectedFile);
        const multiPage = selectedPages.length > 1;
        for (const page of selectedPages) {
          const res = await API.post(
            conversionMap[conversionType].endpoint,
            formData,
            { responseType: "blob", params: { page } }
          );
          const pageFilename = multiPage ? `${baseName}_page_${page}.${ext}` : `${baseName}.${ext}`;
          triggerDownload(res.data, pageFilename, conversionMap[conversionType].mimeType);
        }
        toast.success("Conversion successful 🦋");
        return;
      }

      // ── Everything else ──────────────────────────────────────────────
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

      triggerDownload(
        response.data,
        `${baseName}${conversionMap[conversionType].outputExtension}`,
        conversionMap[conversionType].mimeType
      );
      toast.success("Conversion successful 🦋");

    } catch (err) {
      const detail = err.response?.data instanceof Blob
        ? await err.response.data.text().then((t) => {
            try { return JSON.parse(t).detail; } catch { return null; }
          }).catch(() => null)
        : err.response?.data?.detail;
      toast.error(detail || "Conversion failed. Please try again.");
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

      {conversionType === "MERGE_IMAGES_TO_PDF" && imagePreviews.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-3">
            {imagePreviews.length} image{imagePreviews.length > 1 ? "s" : ""} selected — will be merged in this order
          </p>
          <div className="grid grid-cols-4 gap-3">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img src={preview.url} alt={preview.name} className="w-full object-cover" style={{ height: "80px" }} />
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

      {truncated && (
        <p className="mt-3 text-xs text-yellow-400/80 text-center">
          ⚠️ Large PDF — showing first 50 pages only
        </p>
      )}

      <ConversionSelect conversionType={conversionType} setConversionType={setConversionType} />

      {PAGE_PICKER_TYPES.includes(conversionType) && (
        <SplitPdfSelector
          thumbnails={thumbnails}
          selectedPages={selectedPages}
          setSelectedPages={setSelectedPages}
        />
      )}

      {(selectedFile || selectedFiles.length > 0) && (
        <div className="mt-6">
          <label htmlFor="output-name" className="text-gray-400 text-sm mb-2 block">
            Output file name
          </label>
          <div className="flex items-stretch rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-pink-400/60 transition">
            <input
              id="output-name"
              type="text"
              value={outputName}
              onChange={(e) => {
                setOutputName(e.target.value);
                setNameEditedByUser(true);
              }}
              placeholder="Enter a file name"
              maxLength={150}
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none"
            />
            <span className="flex items-center px-4 text-gray-500 text-sm bg-white/5 border-l border-white/10">
              {getExtensionLabel(conversionType, selectedPages)}
            </span>
          </div>
        </div>
      )}

      <ConvertButton loading={loading} onClick={handleConvert} />
    </motion.div>
  );
}

function triggerDownload(data, filename, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Strip characters that are invalid in filenames on Windows/Mac/Linux,
// collapse whitespace, and trim length so downloads always succeed.
function sanitizeFilename(name) {
  if (!name) return "";
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 150)
    .trim();
}

function getExtensionLabel(conversionType, selectedPages) {
  if (conversionType === "PDF_TO_JPG") {
    return selectedPages.length > 1 ? "_page_N.jpg" : ".jpg";
  }
  if (conversionType === "PDF_TO_PNG") {
    return selectedPages.length > 1 ? "_page_N.png" : ".png";
  }
  return conversionMap[conversionType]?.outputExtension ?? "";
}
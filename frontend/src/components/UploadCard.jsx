import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";

import API from "../services/api";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

const fileAcceptMap = {
  WORD_TO_PDF: ".doc,.docx",
  PDF_TO_WORD: ".pdf",
  PPT_TO_PDF: ".ppt,.pptx",
  EXCEL_TO_PDF: ".xls,.xlsx",
  JPG_TO_PDF: ".jpg,.jpeg",
  PDF_TO_JPG: ".pdf",
  MERGE_PDF: ".pdf",
  SPLIT_PDF: ".pdf"
};

const conversionMap = {
  WORD_TO_PDF: {
    endpoint: "/word/word-to-pdf",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  },

  PDF_TO_WORD: {
    endpoint: "/word/pdf-to-word",
    outputExtension: ".docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },

  PPT_TO_PDF: {
    endpoint: "/ppt/ppt-to-pdf",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  },

  EXCEL_TO_PDF: {
    endpoint: "/excel/excel-to-pdf",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  },

  JPG_TO_PDF: {
    endpoint: "/image/jpg-to-pdf",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  },

  PDF_TO_JPG: {
    endpoint: "/image/pdf-to-jpg",
    outputExtension: ".jpg",
    mimeType: "image/jpeg"
  },

  MERGE_PDF: {
    endpoint: "/pdf/merge",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  },

  SPLIT_PDF: {
    endpoint: "/pdf/split",
    outputExtension: ".pdf",
    mimeType: "application/pdf"
  }
};

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

  const [thumbnails, setThumbnails] =
    useState([]);

  const [conversionType, setConversionType] =
    useState(
      defaultConversion || "WORD_TO_PDF"
    );

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

  const generateThumbnails =
    async (file) => {
      const buffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: buffer
        }).promise;

      const thumbs = [];

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {
        const page =
          await pdf.getPage(i);

        const viewport =
          page.getViewport({
            scale: 0.25
          });

        const canvas =
          document.createElement(
            "canvas"
          );

        const ctx =
          canvas.getContext("2d");

        canvas.width =
          viewport.width;

        canvas.height =
          viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport
        }).promise;

        thumbs.push(
          canvas.toDataURL()
        );
      }

      setThumbnails(thumbs);
    };

  const handleFileChange =
    async (e) => {
      const files =
        Array.from(
          e.target.files
        );

      if (
        conversionType ===
        "MERGE_PDF"
      ) {
        setSelectedFiles(files);
        return;
      }

      const file = files[0];

      setSelectedFile(file);

      if (
        conversionType ===
        "SPLIT_PDF"
      ) {
        await generateThumbnails(
          file
        );
      }
    };

  const handleConvert =
    async () => {
      if (
        !selectedFile &&
        !selectedFiles.length
      ) {
        toast.error(
          "Please select a file"
        );
        return;
      }

      try {
        setLoading(true);

        const formData =
          new FormData();

        if (
          conversionType ===
          "MERGE_PDF"
        ) {
          selectedFiles.forEach(
            (f) =>
              formData.append(
                "files",
                f
              )
          );
        } else {
          formData.append(
            "file",
            selectedFile
          );
        }

        const config = {
          responseType:
            "blob"
        };

        if (
          conversionType ===
            "SPLIT_PDF" &&
          selectedPages.length
        ) {
          config.params = {
            pages:
              selectedPages.join(
                ","
              )
          };
        }

        const response =
          await API.post(
            conversionMap[
              conversionType
            ].endpoint,
            formData,
            config
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                conversionMap[
                  conversionType
                ].mimeType
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href = url;
        a.download =
          "output";

        document.body.appendChild(
          a
        );

        a.click();

        a.remove();

        toast.success(
          "Conversion successful 🦋"
        );

      } catch {
        toast.error(
          "Conversion failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.6
      }}
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
        shadow-2xl
      "
    >
      <Toaster position="top-right" />

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-cyan-400/10 flex items-center justify-center mb-6">
          <Upload
            size={40}
            className="text-cyan-400"
          />
        </div>

        <h2 className="text-3xl font-bold text-white">
          Upload File
        </h2>

        <p className="text-gray-400 mt-3 text-center">
          Drag & drop your file or choose from device
        </p>

        <label className="mt-8 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 cursor-pointer">
          Choose File

          <input
            type="file"
            multiple={
              conversionType ===
              "MERGE_PDF"
            }
            accept={
              fileAcceptMap[
                conversionType
              ]
            }
            className="hidden"
            onChange={
              handleFileChange
            }
          />
        </label>

        {selectedFile && (
          <div className="mt-4 text-gray-300">
            {
              selectedFile.name
            }
          </div>
        )}

        {selectedFiles.length >
          0 && (
          <div className="mt-4 text-gray-300 text-sm">
            {selectedFiles.map(
              (f) => (
                <div
                  key={f.name}
                >
                  {f.name}
                </div>
              )
            )}
          </div>
        )}

        <select
          value={
            conversionType
          }
          onChange={(e) =>
            setConversionType(
              e.target.value
            )
          }
          className="mt-8 w-full bg-[#111827] rounded-xl px-4 py-3"
        >
          <option value="WORD_TO_PDF">WORD → PDF</option>
          <option value="PDF_TO_WORD">PDF → WORD</option>
          <option value="PPT_TO_PDF">PPT → PDF</option>
          <option value="EXCEL_TO_PDF">EXCEL → PDF</option>
          <option value="JPG_TO_PDF">JPG → PDF</option>
          <option value="PDF_TO_JPG">PDF → JPG</option>
          <option value="MERGE_PDF">MERGE PDF</option>
          <option value="SPLIT_PDF">SPLIT PDF</option>
        </select>

        {conversionType ===
          "SPLIT_PDF" &&
          thumbnails.length >
            0 && (
          <div className="grid grid-cols-4 gap-4 mt-6">
            {thumbnails.map(
              (
                img,
                i
              ) => (
                <div
                  key={i}
                  onClick={() => {
                    const p =
                      i + 1;

                    if (
                      selectedPages.includes(
                        p
                      )
                    ) {
                      setSelectedPages(
                        selectedPages.filter(
                          (
                            x
                          ) =>
                            x !==
                            p
                        )
                      );
                    } else {
                      setSelectedPages(
                        [
                          ...selectedPages,
                          p
                        ]
                      );
                    }
                  }}
                  className={`cursor-pointer border rounded ${
                    selectedPages.includes(
                      i + 1
                    )
                      ? "border-cyan-400"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                  />

                  <p className="text-center text-xs py-1">
                    {i + 1}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        <button
          onClick={
            handleConvert
          }
          disabled={
            loading
          }
          className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500"
        >
          {loading
            ? "Metamorphosis... 🐛"
            : "Convert File 🦋"}
        </button>

      </div>
    </motion.div>
  );
}
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { fileAcceptMap } from "../constants/FileAcceptMap";

const extensionToMime = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export default function FilePicker({
  conversionType,
  selectedFile,
  selectedFiles,
  onChange
}) {
  const isMultiple = conversionType === "MERGE_PDF";

  const allowedExtensions = fileAcceptMap[conversionType]
    ?.split(",")
    .map(e => e.trim()) ?? [];

  const accept = allowedExtensions.reduce((acc, ext) => {
    const mime = extensionToMime[ext];
    if (mime) acc[mime] = [];
    return acc;
  }, {});

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const syntheticEvent = {
      target: {
        files: isMultiple ? acceptedFiles : [acceptedFiles[0]]
      }
    };
    onChange(syntheticEvent);
  }, [conversionType, onChange, isMultiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: isMultiple,
    accept
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center
        border-2 border-dashed rounded-2xl
        p-8 cursor-pointer transition
        ${isDragActive
          ? "border-pink-400 bg-pink-400/10"
          : "border-white/20 hover:border-pink-400/60 hover:bg-white/5"
        }
      `}
    >
      <input {...getInputProps()} />

      <div
  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
  style={{
    background: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(251,146,60,0.15))"
  }}
>
  <Upload
    size={40}
    className="text-pink-400"
  />
</div>

      <h2 className="text-3xl font-bold text-white">
        Upload File
      </h2>

      <p className="text-gray-400 mt-3 text-center">
        {isDragActive
          ? "Drop it here..."
          : "Drag & drop your file or click to choose"
        }
      </p>

      {selectedFile && (
        <div className="mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 w-full text-center">
          {selectedFile.name}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 w-full text-center">
          {selectedFiles.map((f) => (
            <div key={f.name}>{f.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
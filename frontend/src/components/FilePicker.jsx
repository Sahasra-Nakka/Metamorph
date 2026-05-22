import { Upload } from "lucide-react";

export default function FilePicker({
  conversionType,
  fileAcceptMap,
  selectedFile,
  selectedFiles,
  onChange
}) {
  return (
    <>
      <div className="flex flex-col items-center">

        <div
          className="
            w-24 h-24
            rounded-full
            bg-cyan-400/10
            flex
            items-center
            justify-center
            mb-6
          "
        >
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

        <label
          className="
            mt-10
            px-6
            py-3
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-400
            transition
            cursor-pointer
            font-semibold
            text-white
          "
        >
          Choose File

          <input
            type="file"
            multiple={
              conversionType === "MERGE_PDF"
            }
            accept={
              fileAcceptMap[
                conversionType
              ]
            }
            className="hidden"
            onChange={onChange}
          />
        </label>

        {selectedFile && (
          <div
            className="
              mt-6
              px-4
              py-3
              rounded-xl
              bg-white/5
              border
              border-white/10
              text-sm
              text-gray-300
              w-full
              text-center
            "
          >
            {selectedFile.name}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div
            className="
              mt-6
              px-4
              py-3
              rounded-xl
              bg-white/5
              border
              border-white/10
              text-sm
              text-gray-300
              w-full
              text-center
            "
          >
            {selectedFiles.map(
              (f) => (
                <div key={f.name}>
                  {f.name}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
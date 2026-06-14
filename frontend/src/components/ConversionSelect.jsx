export default function ConversionSelect({ conversionType, setConversionType }) {
  return (
    <select
      value={conversionType}
      onChange={(e) => setConversionType(e.target.value)}
      className="mt-8 w-full bg-[#111827] text-white rounded-xl px-4 py-3 cursor-pointer"
    >
      <optgroup label="── PDF">
        <option value="MERGE_PDF">MERGE PDF</option>
        <option value="SPLIT_PDF">SPLIT PDF</option>
        <option value="PDF_TO_WORD">PDF → WORD</option>
        <option value="PDF_TO_JPG">PDF → JPG</option>
        <option value="PDF_TO_PNG">PDF → PNG</option>
      </optgroup>
      <optgroup label="── Word">
        <option value="WORD_TO_PDF">WORD → PDF</option>
      </optgroup>
      <optgroup label="── Excel">
        <option value="EXCEL_TO_PDF">EXCEL → PDF</option>
      </optgroup>
      <optgroup label="── PowerPoint">
        <option value="PPT_TO_PDF">PPT → PDF</option>
      </optgroup>
      <optgroup label="── Image">
        <option value="JPG_TO_PDF">JPG → PDF</option>
        <option value="PNG_TO_PDF">PNG → PDF</option>
        <option value="PNG_TO_JPG">PNG → JPG</option>
        <option value="JPG_TO_PNG">JPG → PNG</option>
        <option value="MERGE_IMAGES_TO_PDF">MERGE IMAGES → PDF</option>
      </optgroup>
    </select>
  );
}
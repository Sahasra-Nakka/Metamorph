export default function ConversionSelect({
  conversionType,
  setConversionType
}) {
  return (
    <select
      value={conversionType}
      onChange={(e) => setConversionType(e.target.value)}
      className="mt-8 w-full bg-[#111827] text-white rounded-xl px-4 py-3 cursor-pointer"
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
  );
}
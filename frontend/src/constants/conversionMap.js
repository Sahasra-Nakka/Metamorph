export const conversionMap = {
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
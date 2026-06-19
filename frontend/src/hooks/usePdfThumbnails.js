import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MAX_THUMBNAIL_PAGES = 50;

export default function usePdfThumbnails() {
  const [thumbnails, setThumbnails] = useState([]);
  const [truncated, setTruncated] = useState(false);

  const generateThumbnails = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    const pageCount = pdf.numPages;
    const limit = Math.min(pageCount, MAX_THUMBNAIL_PAGES);
    setTruncated(pageCount > MAX_THUMBNAIL_PAGES);

    const thumbs = [];

    for (let i = 1; i <= limit; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.25 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      thumbs.push(canvas.toDataURL());
    }

    setThumbnails(thumbs);
  };

  return { thumbnails, setThumbnails, generateThumbnails, truncated };
}
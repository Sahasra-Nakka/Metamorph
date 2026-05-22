import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

export default function usePdfThumbnails() {
  const [thumbnails, setThumbnails] =
    useState([]);

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

  return {
    thumbnails,
    setThumbnails,
    generateThumbnails
  };
}
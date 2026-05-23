import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ConversionCard from "../components/ConversionCard";
import UploadCard from "../components/UploadCard";
import { motion, useScroll, useTransform } from "framer-motion";

const tools = [
  { label: "JPG → PDF", key: "JPG_TO_PDF" },
  { label: "PDF → JPG", key: "PDF_TO_JPG" },
  { label: "WORD → PDF", key: "WORD_TO_PDF" },
  { label: "PDF → WORD", key: "PDF_TO_WORD" },
  { label: "PPT → PDF", key: "PPT_TO_PDF" },
  { label: "EXCEL → PDF", key: "EXCEL_TO_PDF" },
  { label: "MERGE PDF", key: "MERGE_PDF" },
  { label: "SPLIT PDF", key: "SPLIT_PDF" }
];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState("WORD_TO_PDF");
  const uploadCardRef = useRef(null);

  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -100]);

  const handleToolSelect = (key) => {
    setSelectedTool(key);
    uploadCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar />

      <main className="overflow-x-hidden">

        <motion.section
          style={{ opacity: heroOpacity, y: heroY }}
          className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
            Metamorph
          </h1>

          <p className="mt-6 text-gray-400 text-xl md:text-2xl max-w-2xl">
            Privacy-first document transformation platform.
          </p>
        </motion.section>

        <div ref={uploadCardRef} className="relative z-10 -mt-20 px-6">
          <UploadCard defaultConversion={selectedTool} />
        </div>

        <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pb-96 px-6">
          {tools.map((tool) => (
            <ConversionCard
              key={tool.key}
              title={tool.label}
              onClick={() => handleToolSelect(tool.key)}
            />
          ))}
        </section>

      </main>
    </div>
  );
}
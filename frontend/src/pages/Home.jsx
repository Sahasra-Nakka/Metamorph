import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ConversionCard from "../components/ConversionCard";
import UploadCard from "../components/UploadCard";
import { motion, useScroll, useTransform } from "framer-motion";

const tools = [
  { label: "JPG → PDF", key: "JPG_TO_PDF", desc: "Convert JPG images to PDF format" },
  { label: "PDF → JPG", key: "PDF_TO_JPG", desc: "Extract pages from PDF as JPG images" },
  { label: "WORD → PDF", key: "WORD_TO_PDF", desc: "Convert Word documents to PDF" },
  { label: "PDF → WORD", key: "PDF_TO_WORD", desc: "Convert PDF files to editable Word docs" },
  { label: "PPT → PDF", key: "PPT_TO_PDF", desc: "Convert PowerPoint slides to PDF" },
  { label: "EXCEL → PDF", key: "EXCEL_TO_PDF", desc: "Convert Excel spreadsheets to PDF" },
  { label: "MERGE PDF", key: "MERGE_PDF", desc: "Combine multiple PDFs into one file" },
  { label: "SPLIT PDF", key: "SPLIT_PDF", desc: "Extract selected pages from a PDF" }
];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState("WORD_TO_PDF");
  const uploadCardRef = useRef(null);
  const toolsRef = useRef(null);
  const aboutRef = useRef(null);

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

  const scrollToTools = () => {
  toolsRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
};

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Navbar
        tools={tools}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onToolsClick={scrollToTools}
        onAboutClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
        onToolSelect={handleToolSelect}
      />

      <main className="overflow-x-hidden">

        {/* Hero */}
        <motion.section
          style={{ opacity: heroOpacity, y: heroY }}
          className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <h1
            className="text-8xl md:text-9xl font-black bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(270deg, #f472b6, #fb923c, #f472b6)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 4s ease infinite"
            }}
          >
            Metamorph
          </h1>

          <style>{`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>

          <p className="mt-6 text-gray-400 text-xl md:text-2xl max-w-2xl">
            Privacy-first document transformation platform.
          </p>

          <motion.button
            onClick={scrollToTools}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-500 hover:text-pink-400 transition cursor-pointer"
          >
            <span className="text-sm tracking-widest uppercase">Scroll</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </motion.section>

        {/* Upload Card */}
        <div ref={uploadCardRef} className="relative z-10 -mt-20 px-6">
          <UploadCard defaultConversion={selectedTool} />
        </div>

        {/* Tools */}
        <div ref={toolsRef} id="tools" className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-4xl font-bold text-white mb-2">Tools</h2>
          <p className="text-gray-400 mb-10">Click to use the tool</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ConversionCard
                key={tool.key}
                title={tool.label}
                desc={tool.desc}
                onClick={() => handleToolSelect(tool.key)}
              />
            ))}
          </div>
        </div>

        {/* About */}
        <div
          ref={aboutRef}
          id="about"
          className="max-w-3xl mx-auto text-center px-6 mt-32 pb-32 flex flex-col items-center justify-center min-h-screen"
        >
          <h2 className="text-4xl font-bold text-white mb-6">About Metamorph</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Metamorph is a privacy-first document transformation platform.
            Your files are processed locally on the server and automatically
            deleted after 10 minutes — never stored, never shared.
            Convert between PDF, Word, Excel, PowerPoint, and image formats
            with ease.
          </p>
        </div>

      </main>
    </div>
  );
}
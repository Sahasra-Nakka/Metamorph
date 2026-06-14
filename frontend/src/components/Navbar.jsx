import { useState, useRef } from "react";

const categories = [
  {
    label: "PDF",
    icon: "📄",
    tools: [
      { label: "Merge PDF",   key: "MERGE_PDF",   desc: "Combine multiple PDFs" },
      { label: "Split PDF",   key: "SPLIT_PDF",   desc: "Extract selected pages" },
      { label: "PDF → Word",  key: "PDF_TO_WORD", desc: "Convert to editable .docx" },
      { label: "PDF → JPG",   key: "PDF_TO_JPG",  desc: "Export pages as JPG" },
      { label: "PDF → PNG",   key: "PDF_TO_PNG",  desc: "Export pages as PNG" },  // ← was missing
    ],
  },
  {
    label: "Word",
    icon: "📝",
    tools: [
      { label: "Word → PDF", key: "WORD_TO_PDF", desc: "Convert .doc / .docx to PDF" },
    ],
  },
  {
    label: "Excel",
    icon: "📊",
    tools: [
      { label: "Excel → PDF", key: "EXCEL_TO_PDF", desc: "Convert .xls / .xlsx to PDF" },
    ],
  },
  {
    label: "PowerPoint",
    icon: "📑",
    tools: [
      { label: "PPT → PDF", key: "PPT_TO_PDF", desc: "Convert .ppt / .pptx to PDF" },
    ],
  },
  {
    label: "Image",
    icon: "🖼️",
    tools: [
      { label: "JPG → PDF", key: "JPG_TO_PDF", desc: "Wrap JPG in a PDF" },
      { label: "PNG → PDF", key: "PNG_TO_PDF", desc: "Wrap PNG in a PDF" },
      { label: "PNG → JPG", key: "PNG_TO_JPG", desc: "Convert PNG to JPG" },
      { label: "JPG → PNG", key: "JPG_TO_PNG", desc: "Convert JPG to PNG" },
    ],
  },
];

export default function Navbar({
  tools,
  onHomeClick,
  onToolsClick,
  onAboutClick,
  onToolSelect,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const open = () => {
    clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setMenuOpen(false), 150);
  };

  return (
    <header className="w-full px-10 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md fixed top-0 z-50 bg-[#0B0F19]/80">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .nav-link {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: #d1d5db;
          transition: color 0.2s;
          padding: 0;
        }
        .nav-link:hover {
          background: linear-gradient(90deg, #f472b6, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mega-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;                          /* anchor to right edge of nav */
          left: auto;                        /* remove left: 50% */
          transform: none;                   /* remove -translate-x-1/2 */
          background: rgba(11, 15, 25, 0.97);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(5, 130px);   /* 130px instead of 160px */
          gap: 8px;
          z-index: 50;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .mega-col-header {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
          padding: 4px 10px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 4px;
        }
        .mega-item {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          padding: 8px 10px;
          transition: background 0.15s;
        }
        .mega-item:hover {
          background: rgba(255,255,255,0.06);
        }
        .mega-item:hover .mega-item-label {
          background: linear-gradient(90deg, #f472b6, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mega-item-label {
          font-size: 0.875rem;
          color: #e5e7eb;
          font-weight: 500;
          display: block;
          line-height: 1.3;
        }
        .mega-item-desc {
          font-size: 0.72rem;
          color: #6b7280;
          display: block;
          margin-top: 2px;
          line-height: 1.4;
        }
      `}</style>

      <h1
        className="text-2xl font-bold bg-clip-text text-transparent cursor-pointer"
        style={{
          backgroundImage: "linear-gradient(270deg, #f472b6, #fb923c, #f472b6)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 4s ease infinite",
        }}
        onClick={onHomeClick}
      >
        Metamorph
      </h1>

      <nav className="flex gap-8 items-center">
        <button className="nav-link" onClick={onHomeClick}>
          Home
        </button>

        <div
          className="relative"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <button className="nav-link" onClick={onToolsClick}>
            Tools ▾
          </button>

          {menuOpen && (
            <div
              className="mega-menu"
              onMouseEnter={open}
              onMouseLeave={close}
            >
              {categories.map((cat) => (
                <div key={cat.label}>
                  <div className="mega-col-header">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </div>
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.key}
                      className="mega-item"
                      onClick={() => {
                        onToolSelect(tool.key);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="mega-item-label">{tool.label}</span>
                      <span className="mega-item-desc">{tool.desc}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="nav-link" onClick={onAboutClick}>
          About
        </button>
      </nav>
    </header>
  );
}
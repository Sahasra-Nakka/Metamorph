import { useState, useRef } from "react";

export default function Navbar({
  tools,
  onHomeClick,
  onToolsClick,
  onAboutClick,
  onToolSelect
}) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const openTools = () => {
    clearTimeout(timeoutRef.current);
    setToolsOpen(true);
  };

  const closeTools = () => {
    timeoutRef.current = setTimeout(() => {
      setToolsOpen(false);
    }, 150);
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
        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 12px 20px;
          font-size: 0.875rem;
          color: #d1d5db;
          background: none;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          display: block;
          transition: background-color 0.15s;
        }
        .dropdown-item:last-child {
          border-bottom: none;
        }
        .dropdown-item:hover {
          background-color: rgba(255,255,255,0.05);
          background-image: linear-gradient(90deg, #f472b6, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <h1
        className="text-2xl font-bold bg-clip-text text-transparent cursor-pointer"
        style={{
          backgroundImage: "linear-gradient(270deg, #f472b6, #fb923c, #f472b6)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 4s ease infinite"
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
          onMouseEnter={openTools}
          onMouseLeave={closeTools}
        >
          <button className="nav-link" onClick={onToolsClick}>
            Tools
          </button>

          {toolsOpen && (
            <div
              className="
                absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2
                w-56 bg-[#0B0F19]/95 border border-white/10
                rounded-2xl shadow-2xl backdrop-blur-xl
                overflow-hidden z-50
              "
              onMouseEnter={openTools}
              onMouseLeave={closeTools}
            >
              {tools.map((tool) => (
                <button
                  key={tool.key}
                  className="dropdown-item"
                  onClick={() => {
                    onToolSelect(tool.key);
                    setToolsOpen(false);
                  }}
                >
                  {tool.label}
                </button>
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
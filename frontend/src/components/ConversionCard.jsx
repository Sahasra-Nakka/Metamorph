import { useState } from "react";
import { motion } from "framer-motion";

export default function ConversionCard({
  title,
  desc,
  onClick
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      className="cursor-pointer w-full"
      style={{ perspective: "1000px", minHeight: "140px" }}
    >
      <style>{`
        @keyframes cardGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <motion.div
        className="relative w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45 }}
        style={{
          transformStyle: "preserve-3d",
          minHeight: "140px"
        }}
      >
        {/* Front */}
        <div
          className="
            absolute inset-0
            rounded-2xl
            border border-white/10
            bg-white/5
            backdrop-blur-lg
            shadow-lg
            flex items-center justify-center
            min-h-[140px]
          "
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-xl font-semibold text-white text-center px-4">
            {title}
          </h2>
        </div>

        {/* Back */}
        <div
          className="
            absolute inset-0
            rounded-2xl
            shadow-lg
            flex flex-col items-center justify-center
            text-center px-5 gap-3
            min-h-[140px]
          "
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "linear-gradient(270deg, #f472b6, #fb923c, #f472b6)",
            backgroundSize: "200% 200%",
            animation: flipped ? "cardGradientShift 4s ease infinite" : "none"
          }}
        >
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="text-white/90 text-sm leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
}
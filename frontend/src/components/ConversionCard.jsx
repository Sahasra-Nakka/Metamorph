import { motion } from "framer-motion";

export default function ConversionCard({
  title,
  onClick
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03
      }}
      transition={{
        duration: 0.2
      }}
      onClick={onClick}
      className="
        group
        relative
        overflow-hidden
        w-full
        min-h-[140px]
        rounded-2xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-lg
        shadow-lg
        cursor-pointer
        flex
        items-center
        justify-center
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-pink-500
          to-orange-500
          translate-x-[-100%]
          group-hover:translate-x-0
          transition-transform
          duration-300
        "
      />

      <h2
        className="
          relative
          z-10
          text-xl
          font-semibold
          text-white
        "
      >
        {title}
      </h2>
    </motion.div>
  );
}
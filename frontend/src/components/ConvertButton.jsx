export default function ConvertButton({
  loading,
  onClick
}) {
  return (
    <>
      <style>{`
        @keyframes btnGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .convert-btn {
          background-image: linear-gradient(270deg, #f472b6, #fb923c, #f472b6);
          background-size: 200% 200%;
          animation: btnGradientShift 4s ease infinite;
          transition: opacity 0.2s;
        }
        .convert-btn:hover {
          opacity: 0.9;
        }
        .convert-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <button
        onClick={onClick}
        disabled={loading}
        className="convert-btn mt-8 w-full py-4 rounded-xl font-semibold text-white text-lg"
      >
        {loading
          ? "Metamorphosis... 🐛"
          : "Convert File 🦋"}
      </button>
    </>
  );
}
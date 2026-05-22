export default function ConvertButton({
  loading,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500"
    >
      {loading
        ? "Metamorphosis... 🐛"
        : "Convert File 🦋"}
    </button>
  );
}
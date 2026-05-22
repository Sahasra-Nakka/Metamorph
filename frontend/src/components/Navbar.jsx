export default function Navbar() {
  return (
    <header className="w-full px-10 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md fixed top-0 z-50 bg-[#0B0F19]/80">
      <h1 className="text-2xl font-bold text-orange-400">
        Metamorph
      </h1>

      <nav className="flex gap-8 text-sm text-gray-300">
        <button className="hover:text-cyan-400 transition">
          Home
        </button>

        <button className="hover:text-cyan-400 transition">
          Tools
        </button>

        <button className="hover:text-cyan-400 transition">
          About
        </button>
      </nav>
    </header>
  );
}
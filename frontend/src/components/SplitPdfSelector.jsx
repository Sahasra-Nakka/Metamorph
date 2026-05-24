export default function SplitPdfSelector({
  thumbnails,
  selectedPages,
  setSelectedPages
}) {
  const togglePage = (page) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(
        selectedPages.filter((x) => x !== page)
      );
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  if (!thumbnails.length) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {thumbnails.map((img, i) => (
        <div
          key={i}
          onClick={() => togglePage(i + 1)}
          className="cursor-pointer rounded overflow-hidden border-2 transition"
          style={{
            borderColor: selectedPages.includes(i + 1)
              ? "#f472b6"
              : "rgba(255,255,255,0.1)"
          }}
        >
          <img src={img} alt={`page ${i + 1}`} className="w-full" />
          <p
            className="text-center text-xs py-1"
            style={{
              color: selectedPages.includes(i + 1) ? "#f472b6" : "#9ca3af"
            }}
          >
            {i + 1}
          </p>
        </div>
      ))}
    </div>
  );
}
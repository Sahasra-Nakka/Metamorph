export default function SplitPdfSelector({
  thumbnails,
  selectedPages,
  setSelectedPages
}) {
  const togglePage =
    (page) => {
      if (
        selectedPages.includes(page)
      ) {
        setSelectedPages(
          selectedPages.filter(
            (x) => x !== page
          )
        );
      } else {
        setSelectedPages([
          ...selectedPages,
          page
        ]);
      }
    };

  if (!thumbnails.length)
    return null;

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {thumbnails.map(
        (img, i) => (
          <div
            key={i}
            onClick={() =>
              togglePage(i + 1)
            }
            className={`cursor-pointer border rounded ${
              selectedPages.includes(
                i + 1
              )
                ? "border-cyan-400"
                : "border-white/10"
            }`}
          >
            <img
              src={img}
              alt="page"
            />

            <p className="text-center text-xs py-1">
              {i + 1}
            </p>
          </div>
        )
      )}
    </div>
  );
}
from pypdf import PdfReader, PdfWriter


def merge_pdfs(pdf_files, output_path):

    merger = PdfWriter()

    for pdf in pdf_files:
        merger.append(pdf)

    merger.write(output_path)

    merger.close()


def split_pdf(input_path, pages, output_path):

    if not pages or not pages.strip():
        raise ValueError(
            "No pages specified"
        )

    reader = PdfReader(input_path)
    writer = PdfWriter()

    total_pages = len(reader.pages)

    try:
        selected_pages = [
            int(p.strip()) - 1
            for p in pages.split(",")
            if p.strip()
        ]
    except ValueError:
        raise ValueError(
            "Invalid page numbers. Please provide comma-separated integers."
        )

    for p in selected_pages:
        if p < 0 or p >= total_pages:
            raise ValueError(
                f"Page {p + 1} is out of range. PDF has {total_pages} pages."
            )
        writer.add_page(reader.pages[p])

    with open(output_path, "wb") as f:
        writer.write(f)
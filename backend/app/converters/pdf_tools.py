from pypdf import PdfWriter


def merge_pdfs(pdf_files, output_path):

    merger = PdfWriter()

    for pdf in pdf_files:
        merger.append(pdf)

    merger.write(output_path)

    merger.close()

from pypdf import PdfReader, PdfWriter


def split_pdf(
    input_path,
    pages,
    output_path
):
    reader = PdfReader(
        input_path
    )

    writer = PdfWriter()

    selected_pages = [
        int(p) - 1
        for p in pages.split(",")
    ]

    for p in selected_pages:
        writer.add_page(
            reader.pages[p]
        )

    with open(
        output_path,
        "wb"
    ) as f:
        writer.write(f)
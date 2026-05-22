from PIL import Image
import fitz
import uuid


def jpg_to_pdf(input_path, output_path):
    image = Image.open(input_path)

    if image.mode == "RGBA":
        image = image.convert("RGB")

    image.save(output_path, "PDF")


def pdf_to_jpg(input_path, output_folder):
    pdf_document = fitz.open(input_path)

    output_files = []

    unique_id = uuid.uuid4()

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        pix = page.get_pixmap()

        output_path = (
            f"{output_folder}/{unique_id}_page_{page_num + 1}.jpg"
        )

        pix.save(output_path)
        output_files.append(output_path)

    return output_files
from pdf2docx import Converter


def pdf_to_docx(input_path, output_path):
    cv = Converter(input_path)
    try:
        cv.convert(output_path)
    finally:
        cv.close()

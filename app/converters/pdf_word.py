from pdf2docx import Converter


def pdf_to_docx(input_path, output_path):

    cv = Converter(input_path)

    cv.convert(output_path)

    cv.close()
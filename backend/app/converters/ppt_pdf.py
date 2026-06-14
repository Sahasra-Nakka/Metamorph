from app.converters.libreoffice import convert_with_libreoffice


def ppt_to_pdf(input_path, output_dir):
    return convert_with_libreoffice(input_path, output_dir)
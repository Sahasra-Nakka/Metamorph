from weasyprint import HTML


def html_to_pdf(input_path, output_path):
    HTML(input_path).write_pdf(output_path)
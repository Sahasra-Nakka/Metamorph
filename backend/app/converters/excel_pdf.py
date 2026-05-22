from pathlib import Path
import subprocess
import os


def excel_to_pdf(input_path, output_dir):

    output_dir = os.path.abspath(
        output_dir
    )

    result = subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            os.path.abspath(input_path),
            "--outdir",
            output_dir
        ],
        capture_output=True,
        text=True
    )

    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
    print("RETURN CODE:", result.returncode)

    if result.returncode != 0:
        raise Exception(
            result.stderr
        )

    pdf_name = (
        Path(input_path).stem + ".pdf"
    )

    output_path = os.path.join(
        output_dir,
        pdf_name
    )

    if not os.path.exists(output_path):
        raise Exception(
            "PDF file was not created"
        )

    return output_path
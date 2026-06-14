import subprocess
import os
import logging

from pathlib import Path

logger = logging.getLogger(__name__)

LIBREOFFICE_TIMEOUT = 60


def convert_with_libreoffice(input_path, output_dir):
    output_dir = os.path.abspath(output_dir)

    result = subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            os.path.abspath(input_path),
            "--outdir",
            output_dir,
        ],
        capture_output=True,
        text=True,
        timeout=LIBREOFFICE_TIMEOUT,
    )

    logger.info(result.stdout)

    if result.returncode != 0:
        logger.error(result.stderr)
        raise Exception("LibreOffice conversion failed")

    pdf_name = Path(input_path).stem + ".pdf"
    output_path = os.path.join(output_dir, pdf_name)

    if not os.path.exists(output_path):
        raise Exception("PDF file was not created")

    return output_path
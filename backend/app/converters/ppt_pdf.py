from pathlib import Path
import subprocess
import os
import logging

logger = logging.getLogger(__name__)


def ppt_to_pdf(input_path, output_dir):

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

    logger.info(result.stdout)

    if result.returncode != 0:
        logger.error(result.stderr)
        raise Exception(
            "LibreOffice conversion failed"
        )

    pdf_name = (
        Path(input_path).stem + ".pdf"
    )

    return os.path.join(
        output_dir,
        pdf_name
    )
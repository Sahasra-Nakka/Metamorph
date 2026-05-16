import subprocess


def word_to_pdf(input_path):

    subprocess.run([
        "soffice",
        "--headless",
        "--convert-to",
        "pdf",
        input_path,
        "--outdir",
        "outputs"
    ])
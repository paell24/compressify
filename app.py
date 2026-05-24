from flask import Flask
from flask import render_template
from flask import request
from flask import send_from_directory
from flask import url_for

import os
import subprocess

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )

@app.route('/outputs/<filename>')
def output_file(filename):
    return send_from_directory(
        OUTPUT_FOLDER,
        filename
    )

@app.route("/compress", methods=["POST"])
def compress_video():

    video = request.files["video"]

    quality = request.form.get(
        "quality",
        "medium"
    )

    filename = video.filename

    input_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    output_filename = (
        "compressed_" + filename
    )

    output_path = os.path.join(
        OUTPUT_FOLDER,
        output_filename
    )

    video.save(input_path)

    before_size = os.path.getsize(
        input_path
    )

    # Compression Quality Settings
    if quality == "high":

        bitrate = "3000k"

    elif quality == "medium":

        bitrate = "1500k"

    else:

        bitrate = "700k"

    command = [
        "ffmpeg",
        "-i", input_path,
        "-vcodec", "libx264",
        "-b:v", bitrate,
        "-preset", "medium",
        output_path,
        "-y"
    ]

    subprocess.run(command)

    after_size = os.path.getsize(
        output_path
    )

    compression = (
        (before_size - after_size)
        / before_size
    ) * 100

    return {

        "before": round(
            before_size / (1024 * 1024),
            2
        ),

        "after": round(
            after_size / (1024 * 1024),
            2
        ),

        "compression": round(
            compression,
            2
        ),

        "download":
            url_for(
                'output_file',
                filename=output_filename
            ),

        "original_video":
            url_for(
                'uploaded_file',
                filename=filename
            ),

        "compressed_video":
            url_for(
                'output_file',
                filename=output_filename
            )
    }

if __name__ == "__main__":
    app.run(debug=True)
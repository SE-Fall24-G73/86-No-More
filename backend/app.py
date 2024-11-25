from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

genai.configure(api_key=os.environ["GEMINI_API_KEY"])


def upload_to_gemini(file_storage, mime_type=None):
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        file_storage.save(tempfile.name)
        file = genai.upload_file(temp_file.name, mime_type=mime_type)
    os.remove(temp_file.name)
    print(f"Uploaded the file '{file.display_name}' as: {file.uri}")
    return file

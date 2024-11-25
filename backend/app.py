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



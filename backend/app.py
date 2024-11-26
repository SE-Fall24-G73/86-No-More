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
        file_storage.save(temp_file.name)
        file = genai.upload_file(temp_file.name, mime_type=mime_type)
    os.remove(temp_file.name)
    print(f"Uploaded the file '{file.display_name}' as: {file.uri}")
    return file


model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config={
        "temperature": 0.1,
        "top_p": 0.95,
        "top_k": 32,
        "max_output_tokens": 10240,
        "response_mime_type": "application/json",
    },
)


@app.route("/caloryDetector", methods=["POST"])
def generate_response():
    image_file = request.files.get("image")
    mime_type = request.form.get("mimeType")

    if not image_file:
        return jsonify({"error": "No image file provided"}), 400

    uploaded_file = upload_to_gemini(image_file, mime_type)

    input_prompt = """
        As a recognized expert in nutritional analysis, your task involves meticulously examining food items displayed in an image and calculating their total caloric content accurately. It is imperative that your response adheres strictly to a structured JSON format to ensure the data is precise and easily interpretable. Furthermore, based on your analysis of the food items, you are tasked with creating a comprehensive meal plan that offers balanced and nutritious meal recommendations for each day of the upcoming week. Each suggested meal must align with dietary guidelines and consider an optimal caloric intake to promote health and well-being.

        Your response must include the following elements:
        1. A detailed enumeration of each food item's caloric content as identified from the image.
        2. The aggregate caloric value of all the food items combined.
        3. A seven-day meal plan that includes recommendations for breakfast, lunch, dinner, and two snacks for each day, designed to maintain a balanced diet.

        Please ensure your response is formatted as structured JSON, adhering to the example format provided below. Note: The ellipsis ("...") symbol is used here to indicate continuation or the presence of additional items or days in the meal plan. These symbols should not be included in your actual JSON response. Ensure no markdown syntax (such as backticks) or additional characters that would invalidate the JSON format are included in your response.

        Example format for your JSON response:

        {
            "image_analysis": {
                "total_calories": "<Total calculated calories>",
                "items": [
                    {"name": "Item 1", "calories": "<number of calories>"},
                    {"name": "Item 2", "calories": "<number of calories>"}
                ]
            },
            "seven_day_meal_plan": {
                "day1": {
                    "breakfast": {
                        "name": "<Meal Name>",
                        "calories": <number of calories>
                    },
                    "lunch": {
                        "name": "<Meal Name>",
                        "calories": <number of calories>
                    },
                    "dinner": {
                        "name": "<Meal Name>",
                        "calories": <number of calories>
                    },
                    "snack1": {
                        "name": "<Snack Name>",
                        "calories": <number of calories>
                    },
                    "snack2": {
                        "name": "<Snack Name>",
                        "calories": <number of calories>
                    }
                },
                "day2": { ... },
                "day3": { ... },
                "day4": { ... },
                "day5": { ... },
                "day6": { ... },
                "day7": { ... }
            }
        }

        Please replace placeholders (e.g., "<Total calculated calories>", "<Meal Name>", "<number of calories>") with actual data values based on your analysis. The JSON response must be free of syntax errors and should not include characters or formatting that would prevent it from being parsed correctly as valid JSON.

    """

    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [uploaded_file, input_prompt],
            },
        ]
    )

    response = chat_session.send_message(input_prompt)

    return jsonify({"response": response.text})


if __name__ == "__main__":
    app.run(debug=True)

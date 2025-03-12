from flask import Flask, request, jsonify
from chatbot_brain import VoiceDriftChatbot
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all origins for all routes
# Initialize chatbot
chatbot = VoiceDriftChatbot()


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "").strip()
    print(user_input)

    if not user_input:
        return jsonify({"response": "Please enter a message."})

    response = chatbot.get_response(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(port=5000)

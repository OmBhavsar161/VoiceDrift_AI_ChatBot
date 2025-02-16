# from flask import Flask, request, jsonify
# import requests
# from flask_cors import CORS

# app = Flask(__name__)

# # Enable CORS for all routes
# CORS(app)

# # Rasa server URL (adjust the IP/port if necessary)
# RASA_URL = "http://localhost:5005/webhooks/rest/webhook"

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_message = request.json.get('message')

#     if not user_message:
#         return jsonify({"error": "No message provided"}), 400

#     # Send the user's message to Rasa
#     response = requests.post(RASA_URL, json={"sender": "user", "message": user_message})

#     if response.status_code == 200:
#         bot_response = response.json()

#         # Check if response contains a link and customize accordingly
#         for message in bot_response:
#             if 'text' in message and 'Click Here' in message['text']:
#                 # If there's a link in the response, parse it and send it back
#                 message['action'] = 'link'
#                 message['link'] = 'https://rera.rajasthan.gov.in/Content/uploads/f70aed69-0f30-420b-9b46-9c47f2235e98.PDF'

#         return jsonify(bot_response)
#     else:
#         return jsonify({"error": "Error connecting to Rasa API"}), 500

# if __name__ == '__main__':
#     app.run(port=5000)

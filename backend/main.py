from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

@app.route('/save', methods=['POST'])
def query():
    if request.method == "POST":
        res = request.get_json()

        # Debugging information
        print("Received JSON:", res)  # Print the received JSON
        print("Type of received JSON:", type(res))  # Print the type of the received JSON

        # Validate that the incoming JSON is a dictionary
        if res is None or not isinstance(res, dict):
            return jsonify({"error": "Invalid JSON format."}), 400
        
        # Validate that the incoming JSON contains the expected keys
        expected_keys = ['links', 'companyUrl', 'counter']
        if not all(key in res for key in expected_keys):
            return jsonify({"error": f"Expected keys: {expected_keys}"}), 400
        
        # Extract values
        links = res['links']
        company_url = res['companyUrl']
        counter = res['counter']

        # Remove None values from links
        links = [link for link in links if link is not None]

        # Check if links is empty after filtering
        if not links:
            return jsonify({"error": "Links cannot be empty after filtering None values."}), 400

        data = {
            company_url[:-6]: links,
        }

        with open("data.json", "r") as f:
            existing_data = json.load(f)

        existing_data.update(data)

        with open('data.json', 'w') as f:
            json.dump(existing_data, f, indent=4)

        return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
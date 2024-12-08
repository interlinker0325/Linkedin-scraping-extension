from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

@app.route('/save', methods=['POST'])
def query():
    if request.method == "POST":
        res = request.get_json()
        print(res, type(res), "request")

        # Validate that the incoming JSON is a list
        if not isinstance(res, list):
            return jsonify({"error": "Expected a JSON array (list)"}), 400

        file_path = "profiles.json"

        # Handle the case where the file is empty or invalid JSON
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)  # Load existing data
            except (json.JSONDecodeError, ValueError):
                data = []  # If the file is invalid or empty, initialize as empty
        else:
            data = []  # If the file doesn't exist, initialize as empty

        # Extend the existing data with the new list
        data.extend(res)

        # Write updated data back to the JSON file
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)  # Use indent for readable JSON formatting

        return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
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

        file_path = "profiles.json"

        # Prepare the content to be saved
        content_to_save = f"{counter}\n{company_url}\n================================\n" + "\n".join(links) + "\n"

        # Handle the case where the file is empty or invalid JSON
        try:
            if os.path.exists(file_path):
                with open(file_path, 'a') as f:  # Append to the existing file
                    f.write(content_to_save)  # Write the new content
            else:
                with open(file_path, 'w') as f:  # Create a new file
                    f.write(content_to_save)  # Write the content
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
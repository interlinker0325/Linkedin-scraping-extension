import json

# Load the JSON data
with open('urls.json', 'r') as file:
    data = json.load(file)

# Modify the URLs
for i in range(len(data)):
    if isinstance(data[i], str):  # Ensure the URL is a string
        if data[i].endswith('/'):
            # If the URL ends with '/', add 'people'
            data[i] += 'people'
        else:
            # If the URL does not end with '/', add '/people'
            data[i] += '/people'

# Save the updated JSON data
with open('urls.json', 'w') as file:
    json.dump(data, file, indent=4)

print("URLs updated successfully.")

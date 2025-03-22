from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Serve the frontend HTML file
@app.route('/')
def home():
    return render_template('frontEnd.html')

# API route to serve menu data
@app.route('/menu')
def get_menu():
    try:
        with open('swiggy_menu.json', 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Menu data not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)


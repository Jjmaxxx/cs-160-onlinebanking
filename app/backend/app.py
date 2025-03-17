from flask import Flask, g, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from db import get_db_connection
from views.auth import auth
import requests

load_dotenv()
app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')


app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
CORS(app, resources={r"/*": {"origins": os.getenv('FRONTEND_URL')}})

@app.before_request
def before_request():
    get_db_connection()

@app.teardown_appcontext
def teardown(exception):
    db_connection = getattr(g, 'db_connection', None)
    if db_connection is not None:
        db_connection.close() 


GOOGLE_MAPS_API_KEY = "AIzaSyAP_OSJjcUfA7HQujvo2tv8hH96s4D3HqY"
GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

cached_response = None

@app.route('/nearbysearch_proxy', methods=['GET'])
def proxy_request():
    print("Received request")
    global cached_response
    # if not GOOGLE_MAPS_API_KEY:
    #     return jsonify({"error": "Missing Google Maps API Key"}), 500
    
    # params = request.args.to_dict()
    # params["key"] = GOOGLE_MAPS_API_KEY  # Ensure API key is included
    
    # if not cached_response:
    #     response = requests.get(GOOGLE_MAPS_API_URL, params=params)
    #     cached_response = response.json()
    # else:
    #     app.logger.warn("Using cached response")
    
    # app.logger.warn("Returning response: %s", cached_response)
    with open("./response.json", "r") as f:
        cached_response = f.read()
    app.logger.warn("Returning response: %s", cached_response)
    return jsonify(cached_response)

if __name__ == '__main__':
    app.run(debug=True, port=12094)
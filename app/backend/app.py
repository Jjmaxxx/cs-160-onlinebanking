from flask import Flask, g, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from db import get_db_connection
from views.auth import auth
from views.user_endpoints import endpoints as user_endpoints
from views.account_endpoints import endpoints as account_endpoints
from views.bank_manager_endpoints import endpoints as bank_manager_endpoints
from middlewares.auth_middleware import authenticate
from flask_apscheduler import APScheduler
from scheduler_jobs import start_scheduler
import requests
from services.logger import logger

load_dotenv()
app = Flask(__name__)
scheduler = APScheduler()
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(user_endpoints, url_prefix='/user')
app.register_blueprint(account_endpoints, url_prefix='/accounts')
app.register_blueprint(bank_manager_endpoints, url_prefix='/bank_manager')

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={r"/*": {"origins": "*", "methods": "GET,POST"}}, supports_credentials=True)

@app.before_request
def before_request():
    get_db_connection()

@app.teardown_appcontext
def teardown(exception):
    db_connection = getattr(g, 'db_connection', None)
    if db_connection is not None:
        db_connection.close() 

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

cached_response = None

@app.route('/nearbysearch_proxy', methods=['GET'])
def proxy_request():
    print("Received request")
    global cached_response
    if not GOOGLE_MAPS_API_KEY:
        return jsonify({"error": "Missing Google Maps API Key"}), 500
    
    params = request.args.to_dict()
    params["key"] = GOOGLE_MAPS_API_KEY  # Ensure API key is included
    
    # if not cached_response:
    response = requests.get(GOOGLE_MAPS_API_URL, params=params)
    jsonresponse = response.json()
    logger().debug("response json: %s", jsonresponse)

    return jsonify(jsonresponse), 200
    # else:
    #     app.logger.warn("Using cached response")
    
    # app.logger.warn("Returning response: %s", cached_response)
    with open("./sjsu_chase_atm_response.json", "r") as f:
        cached_response = f.read()
    app.logger.warn("Returning response: %s", jsonresponse)
    return jsonify(cached_response)


start_scheduler(app)

if __name__ == '__main__':
    app.run(debug=True, port=12094)

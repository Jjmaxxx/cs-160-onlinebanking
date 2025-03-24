from flask import Flask, g, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from db import get_db_connection
from views.auth import auth
from middlewares.auth_middleware import authenticate

load_dotenv()
app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')

app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
CORS(app, resources={r"/*": {"origins": os.getenv('FRONTEND_URL')}})


@app.route("/example_protected_route")
@authenticate
def protected_route():
    print(request.user)
    return jsonify({"message": f"Hi logged in user, {request.user['email']}!"})

@app.before_request
def before_request():
    get_db_connection()

@app.teardown_appcontext
def teardown(exception):
    db_connection = getattr(g, 'db_connection', None)
    if db_connection is not None:
        db_connection.close() 

if __name__ == '__main__':
    app.run(debug=True, port=12094)
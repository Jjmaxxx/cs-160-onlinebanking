from flask import Flask, g
from db import get_db_connection
from views import auth

app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')

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
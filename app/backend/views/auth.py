from flask import Blueprint, jsonify, request
from services.auth import google_authorize_service, google_callback_service, logout_user
from middlewares.auth_middleware import authenticate

auth = Blueprint('auth', __name__)

@auth.route('/google/login')
def authorize():
    return google_authorize_service()

@auth.route('/google/callback')
def callback():
    return google_callback_service()


@auth.route('/logout')
@authenticate
def logout():
    return logout_user()

@auth.route('/authorized')
@authenticate
def check_authorization():
    return jsonify({"authorized": True, "user": request.user}), 200
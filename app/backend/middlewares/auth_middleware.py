from flask import request, jsonify
from functools import wraps
import requests
from daos.auth import get_user

def checkToken(access_token):
    try:
        response = requests.get(
            f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
        )
        if response.status_code == 200:
            response = response.json()
            return response
        return None
    except:
        print(f"Error during token validation")
        return None


def authenticate(f):
    @wraps(f)
    def check_auth(*args, **kwargs):
        access_token = request.cookies.get("access_token")
        if not access_token:
            return jsonify({"error": "Missing access token"}), 401
        token_info = checkToken(access_token)
        if not token_info:
            return jsonify({"error": "Invalid access token"}), 401
        email = token_info.get("email")
        if not email:
            return jsonify({"error": "Invalid token: email missing"}), 401
        try:
            user = get_user(email=email)
        except:
            return jsonify({"error": "Cannot find user in database."}), 401
        request.user = user
        return f(*args, **kwargs)

    return check_auth
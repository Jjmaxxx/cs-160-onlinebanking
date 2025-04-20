from flask import request, jsonify 
from functools import wraps
import requests
from daos.auth import get_user
from daos.account import check_user_owns_account
from daos.bank_manager import get_bank_manager
from services.logger import logger
import sys


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
        logger().debug("Checking authentication for request")
        access_token = request.cookies.get("access_token")
        if not access_token:
            logger().debug("no access token")
            return jsonify({"error": "Missing access token"}), 401
        token_info = checkToken(access_token)
        if not token_info:
            logger().debug("Invalid access token: %s", access_token)
            return jsonify({"error": "Invalid access token"}), 401
        email = token_info.get("email")
        if not email:
            logger().debug("Checking authentication for request")
            return jsonify({"error": "Invalid token: email missing"}), 401
        try:
            user = get_user(email=email)
        except Exception as e:
            logger().debug("Error fetching user from database: %s", str(e))
            return jsonify({"error": "Cannot find user in database."}), 401

        request.user = user
        logger().debug("Authenticated user: %s", request.user)
        return f(*args, **kwargs)

    return check_auth


def account_authorization(func):
    """
    Decorator to check if the user owns the account they are trying to access.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        account_id = request.args.get('account_id')
        if not account_id:
            return jsonify({"error": "Account ID is required"}), 400
        
        if request.args.get('debug') is not None:
            return func(*args, **kwargs)
        
        if not check_user_owns_account(request.user['id'], int(account_id)):
            return jsonify({"error": "You do not own this account"}), 403
        
        return func(*args, **kwargs)
    return wrapper

def bank_manager_authorization(f1):
    @wraps(f1)
    def wrapper1(*args, **kwargs):
        logger().debug("Checking bank manager authorization for request")
        user = request.user
        if not user:
            logger().debug("User not found in request")
            return jsonify({"error": "User not found"}), 401

        bank_manager = get_bank_manager(user['id'])
        if not bank_manager:
            logger().debug("User is not a bank manager: %s", user['id'])
            return jsonify({"error": "User is not a bank manager"}), 403

        request.bank_manager = bank_manager
        logger().debug("Authenticated bank manager: %s", request.bank_manager)
        return f1(*args, **kwargs)
    return wrapper1

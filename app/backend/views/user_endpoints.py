import flask
import os
from flask import Blueprint, jsonify, request
from daos.auth import get_user
from daos.user_info import update_user_info, get_user_accounts
from daos.account import get_user_transactions
from middlewares.auth_middleware import authenticate
from services.logger import logger

endpoints = Blueprint('user_endpoints', __name__)

@endpoints.route("/info")
@authenticate
def get_user_endpoint():
    user = get_user(request.user['email'])

    return jsonify(user)

@endpoints.route("/update", methods=["POST"])
@authenticate
def update_user_endpoint():
    # In a real application, you would update the user info in the database here
    user = request.user
    # For demonstration, let's just return the same user info
    logger().debug("Updating user info for: %s", user)

    def get_new(key):
        # Helper function to get new value or fallback to existing
        return request.json.get(key, user[key])
    
    update_user_info(
        user_id=user['id'],  # Assuming 'id' is the primary key in the user object
        first_name=get_new('first_name'),
        last_name=get_new('last_name'),
        address=get_new('address'),
        zip_code=get_new('zip_code'),
        state=get_new('state'),
        city=get_new('city')
    )

    # Return a success message
    return jsonify({"message": "User info updated successfully", "user": user})

@endpoints.route("/accounts", methods=["GET"])
@authenticate
def get_user_accounts_endpoint():
    """
    Endpoint to get all accounts for the authenticated user.
    """
    user = request.user
    logger().debug("HELLO: %s", user)

    # Get user accounts
    accounts = get_user_accounts(user['id'])

    # Return the accounts
    return jsonify({"accounts": accounts})

@endpoints.route("/transactions")
@authenticate
def get_user_transactions_endpoint():
    """
    Endpoint to get all transactions for the authenticated user.
    """
    user = request.user

    # Get user transactions
    try:
        transactions = get_user_transactions(user['id'])
        return jsonify({"transactions": transactions})
    except Exception as e:
        return jsonify({"error": str(e)}), 400



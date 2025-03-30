from flask import Blueprint, jsonify, request
from daos.account import (
    get_account,
    open_account,
    close_account,
    deposit_to_account,
    withdraw_from_account,
)
from middlewares.auth_middleware import authenticate, account_authorization

endpoints = Blueprint('account_endpoints', __name__)

@endpoints.route("/info")
@authenticate
@account_authorization
def account_info():
    account_id = request.args.get('account_id')
    account = get_account(account_id)
    
    return jsonify(account) if account else jsonify({"error": "Account not found"}), 400

@endpoints.route("/open_account")
@authenticate
def open_account_endpoint():
    user_id = request.user['id']

    open_account(
        user_id=user_id, 
        account_type=request.args.get('account_type', 'checking')
    )

    return jsonify({"message": "Account opened successfully"})

@endpoints.route("/close_account")
@authenticate
@account_authorization
def close_account_endpoint():
    """
    Endpoint to close an account by ID.
    """
    account_id = request.args.get('account_id')
    result = close_account(int(account_id))

    if result:
        return jsonify({"message": "Account closed successfully"})
    else:
        return jsonify({"error": "Failed to close account or account not found"}), 400

@endpoints.route("/deposit")
@authenticate
@account_authorization
def deposit_endpoint():
    """
    Endpoint to deposit money into an account by ID.
    """
    account_id = request.args.get('account_id')
    amount = request.args.get('amount', type=float)
 
    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid deposit amount"}), 400

    deposit_to_account(int(account_id), amount)

    return jsonify({"message": "Deposit successful"})

@endpoints.route("/withdraw")
@authenticate
@account_authorization
def withdraw_endpoint():
    """
    Endpoint to withdraw money from an account by ID.
    """
    account_id = request.args.get('account_id')
    amount = request.args.get('amount', type=float)

    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid withdrawal amount"}), 400
    
    balance = get_account(account_id).get('balance', 0)

    if amount > balance:
        return jsonify({"error": "Insufficient funds for withdrawal"}), 400

    withdraw_from_account(int(account_id), amount)

    return jsonify({"message": "Withdrawal successful"})

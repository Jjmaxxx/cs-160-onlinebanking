from flask import Blueprint, jsonify, request
from daos.user_info import user_id_by_email
from PIL import Image
import io
import pytesseract
import re

from daos.account import (
    get_account,
    open_account,
    close_account,
    deposit_to_account,
    withdraw_from_account,
    transfer_funds,
    user_checking_account
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
 
    try:
        deposit_to_account(int(account_id), amount)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

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

    try:
        withdraw_from_account(int(account_id), amount)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Withdrawal successful"})


def extract_check_amount(text):
    match = re.search(r'\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?', text)
    return match.group(0) if match else "Not found"


@endpoints.route("/deposit_check")
@authenticate
@account_authorization
def deposit_check():
    file = request.files['check_image']
    if not file:
        return "No file uploaded", 400
    image = Image.open(io.BytesIO(file.read()))
    text = pytesseract.image_to_string(image)
    print(text)
    amount = extract_check_amount(text)
    print(amount)

@endpoints.route("/transfer") # Have not tested this endpoint yet
@authenticate
@account_authorization
def transfer_endpoint():
    """
    Endpoint to transfer money between two accounts.
    """
    source_account_id = request.args.get('account_id')
    destination_email = request.args.get('destination_email')
    destination_account_id = request.args.get('destination_account_id')

    if not destination_account_id and not destination_email:
        return jsonify({"error": "Either destination account ID or destination email must be provided"}), 400

    if destination_email:
        destination_user_id = user_id_by_email(destination_email)

        if destination_user_id is None:
            return jsonify({"error": "Recieving user not found"}), 400
 
        destination_account_id = user_checking_account(destination_user_id).get('id')

        if not destination_account_id:
            return jsonify({"error": "Recieving user does not have a checking account"}), 400

    amount = request.args.get('amount', type=float)

    try:
        transfer_funds(int(source_account_id), int(destination_account_id), amount)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Transfer successful"})

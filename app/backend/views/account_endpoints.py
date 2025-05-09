from flask import Blueprint, jsonify, request
from daos.user_info import user_id_by_email
from services.logger import logger
import requests
import os
import functools

from daos.account import (
    get_account,
    open_account,
    close_account,
    deposit_to_account,
    withdraw_from_account,
    transfer_funds,
    user_checking_account,
    add_bill_payment,
    get_bill_payments,
    get_all_bill_payments,
    get_account_by_number
)
from services.account import (
    read_check
)
from middlewares.auth_middleware import authenticate, account_authorization

GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

endpoints = Blueprint('account_endpoints', __name__)

@endpoints.route("/info")
@authenticate
@account_authorization
def account_info():
    account_id = request.args.get('account_id')
    account = get_account(account_id)
    
    return jsonify(account) if account else jsonify({"error": "Account not found"}), 400

@endpoints.route("/open_account", methods = ["POST"])
@authenticate
def open_account_endpoint():
    data = request.get_json()
    user_id = request.user['id']
    open_account(
        user_id=user_id, 
        account_type= data.get('account_type', 'checking')
    )
    return jsonify({"message": "Account opened successfully"})

@endpoints.route("/close_account", methods = ["POST"])
@authenticate
@account_authorization
def close_account_endpoint():
    """
    Endpoint to close an account by ID.
    """
    account_id = request.args.get('account_id')
    dest_account_id = request.args.get('dest_account_id')
    try:
        close_account(int(account_id), dest_account_id)    
    except Exception as e:
        return jsonify({"error": "Failed to close account"}), 400
    return jsonify({"message": "Account closed successfully"})
        

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


@endpoints.route("/deposit_check", methods=["POST"])
@authenticate
@account_authorization
def deposit_check():
    account_id = request.args.get('account_id')
    check_image = request.files['check_image']
    if not check_image:
        return "No file uploaded", 400
    amount = read_check(int(account_id),check_image)
    if amount:
        return jsonify({"message": f'${amount} has been deposited'}), 200
    return jsonify({"error": f'File not detected to be a check with money.'}), 500

@endpoints.route("/transfer")
@authenticate
@account_authorization
def transfer_endpoint():
    """
    Endpoint to transfer money between two accounts.
    """
    source_account_id = request.args.get('account_id')
    destination_account_number = request.args.get('destination_account_number')
    amount = request.args.get('amount', type=float)
    try:
        destination_account_id = get_account_by_number(destination_account_number)
        if not destination_account_id:
            return jsonify({"error": "Could not find destination account"}), 404
        transfer_funds(int(source_account_id), int(destination_account_id.get("id")), amount)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Transfer successful"})

@endpoints.route("/register_bill_payment")
@authenticate
@account_authorization
def bill_endpoint():
    """
    Endpoint to register a bill payment.
    """
    account_id = request.args.get('account_id')
    bill_name = request.args.get('bill_name')
    amount = request.args.get('amount', type=float)
    due_date = int(request.args.get('due_date'))
    dest_account_num = int(request.args.get('dest_account_num'))
    logger().debug("HERRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEE")

    try:
        add_bill_payment(int(account_id), bill_name, amount, due_date, dest_account_num)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Bill payment registered successfully"})

@endpoints.route("/get_bill_payments")
@authenticate
@account_authorization
def get_bill_payments_endpoint():
    """
    Endpoint to retrieve bill payments for an account.
    """
    account_id = request.args.get('account_id')
    status = request.args.get('status')
    payments = get_bill_payments(int(account_id), status)

    if not payments:
        return jsonify({"error": "No bill payments found for this account"}), 400

    return jsonify(payments)


@endpoints.route("/get_all_bill_payments")
@authenticate
def get_all_bill_payments_endpoint():
    """
    Endpoint to retrieve all bill payments for a user.
    """
    user_id = request.user["id"]
    payments = get_all_bill_payments(int(user_id))
    if not payments:
        return jsonify({"error": "No bill payments found for this user"}), 400

    return jsonify(payments)

google_maps_cache = {}

def google_map_request(params):
    # convert params dict to hashable tuple
    params_tuple = tuple(sorted(params.items()))
    if params_tuple in google_maps_cache:
        logger().debug("Cache hit for params: %s", params)
        return google_maps_cache[params_tuple]
    
    logger().debug("Cache miss for params: %s", params)
    response = requests.get(GOOGLE_MAPS_API_URL, params=params)
    google_maps_cache[params_tuple] = response

    return response

@endpoints.route('/nearbysearch_proxy', methods=['GET'])
def proxy_request():
    print("Received request")
    global cached_response
    if not GOOGLE_MAPS_API_KEY:
        return jsonify({"error": "Missing Google Maps API Key"}), 500
    
    params = request.args.to_dict()
    params["key"] = GOOGLE_MAPS_API_KEY  # Ensure API key is included
    
    # if not cached_response:
    response = google_map_request(params)
    jsonresponse = response.json()
    #logger().debug("response json: %s", jsonresponse)

    return jsonresponse, 200

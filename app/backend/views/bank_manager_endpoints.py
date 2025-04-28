import flask
from services.logger import logger
import os
from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import authenticate, bank_manager_authorization
from daos.bank_manager import get_all_user_accounts, get_all_user_reports, get_report_batch, get_report_batches, insert_report_batch, generate_user_reports, get_bank_manager, get_all_users, user_reports_to_csv_format, summarize_transactions, get_all_transactions

endpoints = Blueprint('bank_manager_endpoints', __name__)

@endpoints.route("/info")
@authenticate
@bank_manager_authorization
def get_bank_manager_endpoint():
    bank_manager = get_bank_manager(request.user['id'])

    return jsonify(bank_manager)

@endpoints.route("/all_users")
@authenticate
@bank_manager_authorization
def get_all_users_endpoint():
    """
    Endpoint to retrieve all users.
    """
    users = get_all_users()

    if not users:
        return jsonify({"error": "No users found"}), 404

    return jsonify(users), 200

@endpoints.route("/all_user_accounts")
@authenticate
@bank_manager_authorization
def get_all_user_accounts_endpoint():
    """
    Endpoint to retrieve all user accounts.
    """
    user_accounts = get_all_user_accounts()

    if not user_accounts:
        return jsonify({"error": "No user accounts found"}), 404

    return jsonify(user_accounts), 200


@endpoints.route("/all_report_batches")
@authenticate
@bank_manager_authorization
def get_all_report_batches():
    """
    Endpoint to retrieve all report batches.
    """
    report_batches = get_report_batches()

    if not report_batches:
        return jsonify({"error": "No report batches found"}), 404

    return jsonify(report_batches), 200

@endpoints.route("/user_reports_batch")
@authenticate
@bank_manager_authorization
def get_user_reports_batch():
    """
    Endpoint to retrieve user reports batch.
    """
    batch_id = request.args.get('batch_id')
 
    user_reports = get_report_batch(batch_id)

    csv_user_reports = user_reports_to_csv_format(user_reports)

    return jsonify({"csv_user_reports": csv_user_reports, "user_reports": user_reports}), 200


@endpoints.route("/generate_report", methods=["POST"])
@authenticate
@bank_manager_authorization
def generate_report_endpoint():
    """
    Endpoint to generate report batch.
    """
    user_reports = generate_user_reports()

    # Get manager id
    bank_manager = get_bank_manager(request.user['id'])
    bank_manager_id = bank_manager['id']

    # Add to database
    batch_id = insert_report_batch(bank_manager_id, user_reports)

    # Return as csv_file
    csv_user_reports = user_reports_to_csv_format(user_reports)


    return jsonify({"csv_user_reports": csv_user_reports, "user_reports": user_reports, "batch_id": batch_id }), 200

# This one doesn't save to database, just generates the report and returns it
@endpoints.route("/generate_report_display", methods=["POST"])
@authenticate
@bank_manager_authorization
def generate_report_display_endpoint():
    """
    Endpoint to generate report batch.
    """
    user_reports = generate_user_reports()

    # Get manager id
    bank_manager = get_bank_manager(request.user['id'])
    bank_manager_id = bank_manager['id']

    # Add to database
    # batch_id = insert_report_batch(bank_manager_id, user_reports)

    # Return as csv_file
    csv_user_reports = user_reports_to_csv_format(user_reports)


    return jsonify({"csv_user_reports": csv_user_reports, "user_reports": user_reports}), 200

@endpoints.route("/summarize_transactions")
@authenticate
@bank_manager_authorization
def summarize_transactions_endpoint():
    transactions = summarize_transactions(get_all_transactions())

    return jsonify(transactions), 200

reports = []

@endpoints.route("/save_report", methods=["POST"])
def save_report():
    data = request.get_json()
    reports.append(data)
    logger().debug(f"Received data: {data}")

    return jsonify({"message": "Report saved successfully"}), 200

@endpoints.route("/get_all_reports", methods=["GET", "POST"])
def get_all_reports():
    return jsonify(reports), 200


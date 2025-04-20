import flask
import os
from flask import Blueprint, jsonify, request
from middlewares.auth_middleware import authenticate, bank_manager_authorization
from daos.bank_manager import insert_report_batch, generate_user_reports, get_bank_manager, get_all_users, user_reports_to_csv_format

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
    insert_report_batch(bank_manager_id, user_reports)

    # Return as csv_file
    csv_user_reports = user_reports_to_csv_format(user_reports)

    return jsonify({"csv_user_reports": csv_user_reports, "user_reports": user_reports}), 200
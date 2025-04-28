from db import fetch_all, execute_query, fetch_one
from services.logger import logger
import sys
import time
from decimal import Decimal

"""
USER SCHEMA (for copilot to go off of):

CREATE TABLE IF NOT EXISTS users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(50),
    zip_code VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bank_managers(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_role UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS report_batches(
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_manager_id) REFERENCES bank_managers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_reports(
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    total_accounts INT DEFAULT 0,
    total_balance DECIMAL(15, 2) DEFAULT 0.00,
    total_transactions INT DEFAULT 0,
    total_money_deposited DECIMAL(15, 2) DEFAULT 0.00,
    total_money_withdrawn DECIMAL(15, 2) DEFAULT 0.00,
    total_money_transferred DECIMAL(15, 2) DEFAULT 0.00,
    total_money_received DECIMAL(15, 2) DEFAULT 0.00,
    zip_code VARCHAR(50),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES report_batches(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_report UNIQUE(user_id, batch_id)
);


CREATE TABLE IF NOT EXISTS accounts(
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    account_type ENUM('savings', 'checking') DEFAULT 'checking',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    account_status ENUM('active', 'suspended', 'closed') DEFAULT 'active',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS transactions(
	id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    transaction_type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
	transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    destination_account_id INT DEFAULT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payee_name VARCHAR(255) NOT NULL,
    payee_account_id INT,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
    bill_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payee_account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

"""

def get_bank_manager(id_):
    """
    Retrieve bank manager information by user ID.
    """
    query = '''
        SELECT * FROM bank_managers
        WHERE user_id = %s;
    '''
    result = fetch_one(query, (id_,))
    return result


def get_all_users():
    """
    Retrieve all users from the database.
    """
    query = '''
        SELECT * FROM users;
    '''
    result = fetch_all(query)
    return result

def get_all_user_accounts():
    """
    Retrieve all accounts from the database with their users.
    """
    query = '''
        SELECT *
        FROM accounts a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC;
    '''
    result = fetch_all(query)
    return result

def get_report_batches():
    """
    Retrieve all report batches from the database linked with the bank manager's user id.
    """
    # use id and created_by of report_batches
    query = '''
        SELECT rb.id AS batch_id, rb.created_at AS batch_created_at,
            bm.user_id AS user_id, bm.id AS bank_manager_id, u.first_name, u.last_name, u.email,
            COUNT(ur.id) AS total_user_reports
        FROM report_batches rb
        LEFT JOIN bank_managers bm ON rb.bank_manager_id = bm.id
        LEFT JOIN users u ON bm.user_id = u.id
        LEFT JOIN user_reports ur ON rb.id = ur.batch_id
        GROUP BY rb.id, bm.user_id, u.first_name, u.last_name
        ORDER BY rb.created_at DESC;
    '''
    result = fetch_all(query)
    logger().debug("Report Batches: %s", result)
    return result


def get_report_batch(batch_id):
    """
    Retrieve report batch information by batch ID. Joined with user reports.
    """
    query = '''
        SELECT rb.id AS batch_id, rb.created_at AS batch_created_at,
            ur.user_id, ur.full_name, ur.total_accounts, ur.total_balance,
            ur.total_transactions, ur.total_money_deposited,
            ur.total_money_withdrawn, ur.total_money_transferred,
            ur.total_money_received, ur.zip_code
        FROM report_batches rb
        LEFT JOIN user_reports ur ON rb.id = ur.batch_id
        WHERE rb.id = %s;
    '''
    result = fetch_all(query, (batch_id,))
    return result

def get_all_user_reports():
    """
    Retrieve all user reports from the database.
    """
    query = '''
        SELECT * FROM user_reports;
    '''
    result = fetch_all(query)
    return result


def generate_user_reports():
    """
    Generate report for all users.
    """
    query = '''
        SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS full_name,
            COUNT(DISTINCT a.id) AS total_accounts,
            COALESCE(SUM(a.balance), 0) AS total_balance,
            COALESCE(SUM(CASE WHEN t.transaction_type = 'deposit' THEN t.amount ELSE 0 END), 0) AS total_money_deposited,
            COALESCE(SUM(CASE WHEN t.transaction_type = 'withdrawal' THEN t.amount ELSE 0 END), 0) AS total_money_withdrawn,
            COALESCE(SUM(CASE WHEN t.transaction_type = 'transfer' AND t.account_id = a.id THEN t.amount ELSE 0 END), 0) AS total_money_transferred,
            COALESCE(SUM(CASE WHEN t.transaction_type = 'transfer' AND t.destination_account_id = a.id THEN t.amount ELSE 0 END), 0) AS total_money_received,
            COALESCE(COUNT(t.id), 0) AS total_transactions,
            u.zip_code
        FROM users u
        LEFT JOIN accounts a ON u.id = a.user_id
        LEFT JOIN transactions t ON a.id = t.account_id OR a.id = t.destination_account_id
        GROUP BY u.id;
    '''
    result = fetch_all(query)
    return result

def user_reports_to_csv_format(user_reports):
    """
    Convert user reports to CSV format.
    """
    csv_data = "User ID,Full Name,Total Accounts,Total Balance,Total Money Deposited,Total Money Withdrawn,Total Money Transferred,Total Money Received,Total Transactions,Zip Code\n"
    for user_report in user_reports:
        csv_data += ",".join([
            str(user_report.get("id", "")),
            str(user_report.get("full_name", "")),
            str(user_report.get("total_accounts", "")),
            str(user_report.get("total_balance", "")),
            str(user_report.get("total_money_deposited", "")),
            str(user_report.get("total_money_withdrawn", "")),
            str(user_report.get("total_money_transferred", "")),
            str(user_report.get("total_money_received", "")),
            str(user_report.get("total_transactions", "")),
            str(user_report.get("zip_code", ""))
        ]) + "\n"
    return csv_data

def get_all_transactions():
    # get all transactions, joined with accounts and users
    trasnactions = '''
        SELECT t.*, a.account_type, a.balance, u.*
        FROM transactions t
        LEFT JOIN accounts a ON t.account_id = a.id
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY t.transaction_date DESC;
    '''
    return fetch_all(trasnactions)



def summarize_transactions(transactions):
    user_data = {}

    for txn in transactions:
        email = txn.get('email', 'unknown@example.com')
        first_name = txn.get('first_name') or 'Unknown'
        last_name = txn.get('last_name') or ''
        full_name = f"{first_name} {last_name}".strip()

        key = (email, full_name)

        if key not in user_data:
            user_data[key] = {
                'email': email,
                'full_name': full_name,
                'address': txn.get('address'),
                'city': txn.get('city'),
                'state': txn.get('state'),
                'zip_code': txn.get('zip_code'),
                'number_of_accounts': set(),
                'transactions': 0,
                'money_moved': Decimal('0.0'),
                'total_balance': Decimal('0.0')
            }

        user_data[key]['number_of_accounts'].add(txn.get('account_type'))
        user_data[key]['transactions'] += 1
        user_data[key]['money_moved'] += txn.get('amount', Decimal('0'))
        user_data[key]['total_balance'] += txn.get('balance', Decimal('0'))

    # Format the result into a list of dicts
    result = []
    for data in user_data.values():
        result.append({
            'email': data['email'],
            'full_name': data['full_name'],
            'address': data['address'],
            'city': data['city'],
            'state': data['state'],
            'zip_code': data['zip_code'],
            'number_of_accounts': len(data['number_of_accounts']),
            'transactions': data['transactions'],
            'money_moved': float(round(data['money_moved'], 2)),
            'total_balance': float(round(data['total_balance'], 2))
        })

    return result


    return result

def insert_report_batch(_bank_manager_id, user_reports = None):
    """
    Insert a report batch with all the user reports.
    """

    logger().debug("Result of get_all_transactions: %s", get_all_transactions())
    logger().debug("Result of summarize_transactions: %s", summarize_transactions(get_all_transactions()))

    # Create report batch and store into db
    execute_query('''
        INSERT INTO report_batches (bank_manager_id)
        VALUES (%s);
    ''', (_bank_manager_id, ))

    # fetch the last inserted batch ID
    query = '''
        SELECT id FROM report_batches
        WHERE bank_manager_id = %s
        ORDER BY created_at DESC
        LIMIT 1;
    '''
    result = fetch_one(query, (_bank_manager_id,))

    # Print only batch id
    logger().debug("Batch ID: %s", result["id"])

    # Create user reports and store into db
    if user_reports is None:
        user_reports = generate_user_reports()

    for user_report in user_reports:
        query = '''
            INSERT INTO user_reports (batch_id, user_id, full_name, total_accounts, total_balance,
                total_transactions, total_money_deposited, total_money_withdrawn,
                total_money_transferred, total_money_received, zip_code)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        '''
        execute_query(query, (
            result["id"],   # batch_id
            user_report.get("id"),
            user_report.get("full_name"),
            user_report.get("total_accounts"),
            user_report.get("total_balance"),
            user_report.get("total_transactions"),
            user_report.get("total_money_deposited"),
            user_report.get("total_money_withdrawn"),
            user_report.get("total_money_transferred"),
            user_report.get("total_money_received"),
            user_report.get("zip_code")
        ))

    # Return the batch ID for reference
    return result["id"]

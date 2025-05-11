from db import fetch_all, execute_query, fetch_one
from services.logger import logger
import sys
from datetime import datetime
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

def get_account(id_):
    """
    Retrieve account information by account ID.
    """
    query = '''
        SELECT * FROM accounts
        WHERE id = %s;
    '''
    
    logger().debug("Fetching account for id: %s", id_)
    
    account = fetch_one(query, (id_,))
    
    if not account:
        logger().debug("No account found for id: %s", id_)
    
    return account

def get_account_by_number(account_number):
    """
    Retrieve account information by account number.
    """
    query = '''
        SELECT * FROM accounts
        WHERE account_number = %s;
    '''
    
    logger().debug("Fetching account for inumberd: %s", account_number)
    
    account = fetch_one(query, (account_number,))
    
    if not account:
        logger().debug("No account found for id: %s", account_number)
    
    return account

def user_checking_account(user_id: int):
    """
    Retrieve a checking account for a user.
    This will return the first checking account found for the user.
    """
    query = '''
        SELECT * FROM accounts
        WHERE user_id = %s AND account_type = 'checking' AND account_status = 'active';
    '''
    
    logger().debug("Fetching checking account for user_id: %s", user_id)
    
    account = fetch_one(query, (user_id,))
    
    if not account:
        logger().debug("No active checking account found for user_id: %s", user_id)
    
    return account

def open_account(user_id: int, account_type: str = 'checking'):
    """
    Open a new account for a user with the specified account type.
    """
    query = '''
        INSERT INTO accounts (user_id, account_type)
        VALUES (%s, %s);
    '''
    
    logger().debug("Opening account for user_id: %s with account_type: %s", user_id, account_type)
    
    # Execute the query
    result = execute_query(query, (user_id, account_type))
    
    if result:
        logger().debug("Account opened successfully for user_id: %s", user_id)
    
    return result

def close_account(id_: int, dest_account_id: int = None):
    """
    Close an account by setting its status to 'closed'.
    """
    query = '''
        UPDATE accounts
        SET account_status = 'closed'
        WHERE id = %s;
    '''
    logger().debug("Closing account for id: %s", id_, "sending money to")
    try:
        dest_account_id = int(dest_account_id)
        if dest_account_id:
            account = get_account(id_)
            transfer_funds(int(id_), int(dest_account_id), float(account.get('balance')))
    except Exception as e:
        print("Could not transfer funds.")
        
    # Execute the query
    result = execute_query(query, (id_,))
    logger().debug("Account closed successfully for id: %s", id_)
    return result

def deposit_to_account(id_: int, amount: float, record_transaction: bool = True):
    """
    Deposit money into an account by updating the balance.
    Ensure the deposit amount is positive.
    """
    if amount <= 0:
        raise Exception("Deposit amount must be greater than 0")
    
    query = '''
        UPDATE accounts
        SET balance = balance + %s
        WHERE id = %s AND account_status = 'active';
    '''
    
    logger().debug("Depositing %s to account id: %s", amount, id_)

    execute_query(query, (amount, id_))

    if record_transaction:
        execute_query('''
            INSERT INTO transactions (account_id, transaction_type, amount, transaction_status)
            VALUES (%s, %s, %s, %s);
        ''', (id_, 'deposit', amount, 'completed'))
    
    return True

def withdraw_from_account(id_: int, amount: float, record_transaction: bool = True):
    """
    Withdraw money from an account by updating the balance.
    Ensure the withdrawal does not exceed the current balance.
    """

    logger().debug("Withdrawing %s from account id: %s", amount, id_)

    balance = get_account(id_).get('balance', 0)
    if balance < amount:
        raise Exception("Insufficient funds for withdrawal")
    
    if amount <= 0:
        raise Exception("Withdrawal amount must be greater than 0")

    query = '''
        UPDATE accounts
        SET balance = balance - %s
        WHERE id = %s AND account_status = 'active' AND balance >= %s;
    '''
    execute_query(query, (amount, id_, amount))

    if record_transaction:
        execute_query('''
            INSERT INTO transactions (account_id, transaction_type, amount, transaction_status)
            VALUES (%s, %s, %s, %s);
        ''', (id_, 'withdrawal', amount, 'completed'))
    
    return True

def transfer_funds(source_account_id: int, destination_account_id: int, amount: float):
    """
    Transfer funds from one account to another.
    Ensure the transfer amount is positive and sufficient funds are available in the source account.
    """

    # Withdraw from source account
    withdraw_from_account(source_account_id, amount, record_transaction=False)

    # Deposit to destination account
    deposit_to_account(destination_account_id, amount, record_transaction=False)

    # Record the transaction for both accounts
    execute_query('''
        INSERT INTO transactions (account_id, transaction_type, amount, transaction_status, destination_account_id)
        VALUES (%s, %s, %s, %s, %s);
    ''', (source_account_id, 'transfer', amount, 'completed', destination_account_id))

    logger().debug(
        "Transferred %s from account id: %s to account id: %s",
        amount, source_account_id, destination_account_id
    )
    return True

def check_user_owns_account(user_id: int, account_id: int):
    """
    Check if a user owns the specified account.
    """
    query = '''
        SELECT COUNT(*) as count FROM accounts
        WHERE id = %s AND user_id = %s;
    '''
 
    # Fetch the count of accounts matching the criteria
    result = fetch_one(query, (account_id, user_id))
    
    if result and result['count'] > 0:
        return True
    else:
        return False

def get_user_transactions(user_id: int):
    """
    Retrieve all transactions for a user.
    """
    query = '''
        SELECT t.*, a.account_number
        FROM transactions t
        INNER JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = %s;
    '''
    
    logger().debug("Fetching transactions for user_id: %s", user_id)
    
    transactions = fetch_all(query, (user_id,))
    
    if not transactions:
        logger().debug("No transactions found for user_id: %s", user_id)
    
    return transactions
# add_bill_payment(int(account_id), bill_name, amount, due_date)

def add_bill_payment(account_id: int, bill_name: str, amount: float, due_date: int, dest_account_num: int):
    """
    Register a bill payment for an account. (due_date is unix timestamp)
    """
    dest_account_id = int(get_account_by_number(dest_account_num).get("id"))
    query = '''
        INSERT INTO bill_payments (payee_name, payee_account_id, amount, payment_date, destination_account_id)
        VALUES (%s, %s, %s, FROM_UNIXTIME(%s), %s);
    '''
    
    logger().debug(
        "Adding bill payment for account_id: %s, bill_name: %s, amount: %s, due_date: %s, dest account id: %s",
        account_id, bill_name, amount, due_date, dest_account_id
    )
    
    # Execute the query
    result = execute_query(query, (bill_name, account_id, amount, due_date, dest_account_id))
    
    if result:
        logger().debug("Bill payment added successfully for account_id: %s", account_id)
    else:
        raise ValueError("Error: Amount cannot be 0 or below.")
    
    return result

def get_bill_payments(account_id: int, status: str = 'pending'):
    """
    Retrieve bill payments for an account.
    """
    query = '''
        SELECT * FROM bill_payments
        WHERE payee_account_id = %s AND bill_status = %s;
    '''
    
    logger().debug("Fetching bill payments for account_id: %s", account_id)
    
    payments = fetch_all(query, (account_id, status))
    
    if not payments:
        logger().debug("No bill payments found for account_id: %s", account_id)
    
    return payments


def get_all_bill_payments(user_id: int, status: str = "pending"):
    """
    Retrieve all bill payments from a user.
    """
    query = '''
        SELECT bp.*, a.account_number FROM bill_payments bp
        LEFT JOIN accounts a ON bp.payee_account_id = a.id 
        WHERE a.user_id = %s AND bp.bill_status = %s;
    '''
    logger().debug("Fetching bill payments for user_id: %s", user_id)
    
    payments = fetch_all(query, (user_id, status))
    if not payments:
        logger().debug("No bill payments found for user_id: %s", user_id)
    
    return payments

def become_admin(user_id: int):
    """
    Update the user to become an admin.
    """
    query = '''
        INSERT INTO bank_managers (user_id) VALUES (%s);
    '''
    
    logger().debug("Updating user_id: %s to become admin", user_id)
    
    result = execute_query(query, (user_id,))
    
    if result:
        logger().debug("User_id: %s is now an admin", user_id)
    
    return result
def get_bill_payments_today():
    """
    Retrieve all bill payments whose payment_date is today or earlier.
    """
    query = '''
        SELECT * FROM bill_payments
        WHERE payment_date <= %s AND bill_status = 'pending';
    '''
    current_time = datetime.now()

    payments = fetch_all(query, (current_time,))
    if not payments:
        return None

    return payments

def set_bill_payment_status(bill_id: int, status: str):
    """
    Sets the bill payment status to 'failed' or 'completed' for a given bill ID.
    """
    if status not in ("failed", "completed"):
        raise ValueError("Status must be either 'failed' or 'completed'")

    query = '''
        UPDATE bill_payments
        SET bill_status = %s
        WHERE id = %s;
    '''

    execute_query(query, (status, bill_id))

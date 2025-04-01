from db import fetch_all, execute_query, fetch_one
from services.logger import logger
import sys

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

def close_account(id_: int):
    """
    Close an account by setting its status to 'closed'.
    """
    query = '''
        UPDATE accounts
        SET account_status = 'closed'
        WHERE id = %s;
    '''
    
    logger().debug("Closing account for id: %s", id_)
    
    # Execute the query
    result = execute_query(query, (id_,))
    
    if result:
        logger().debug("Account closed successfully for id: %s", id_)
    else:
        logger().debug("Failed to close account for id: %s", id_)
    
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

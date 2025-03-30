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

def open_account(user_id: int, account_type: str = 'checking'):
    """
    Open a new account for a user with the specified account type.
    """
    query = '''
        INSERT INTO accounts (user_id, account_type)
        VALUES (%s, %s);
    '''
    
    # Default to checking if no type is provided
    if account_type not in ['savings', 'checking']:
        account_type = 'checking'
    
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

def deposit_to_account(id_: int, amount: float):
    """
    Deposit money into an account by updating the balance.
    """
    query = '''
        UPDATE accounts
        SET balance = balance + %s
        WHERE id = %s AND account_status = 'active';
    '''
    
    logger().debug("Depositing %s to account id: %s", amount, id_)
    
    # Execute the query
    execute_query(query, (amount, id_))

def withdraw_from_account(id_: int, amount: float):
    """
    Withdraw money from an account by updating the balance.
    Ensure the withdrawal does not exceed the current balance.
    """
    query = '''
        UPDATE accounts
        SET balance = balance - %s
        WHERE id = %s AND account_status = 'active' AND balance >= %s;
    '''
    
    logger().debug("Withdrawing %s from account id: %s", amount, id_)
    
    # Execute the query
    result = execute_query(query, (amount, id_, amount))
    
    if result:
        logger().debug("Withdrawal successful for account id: %s", id_)
    else:
        logger().debug("Failed to withdraw from account id: %s", id_)
    
    return result

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

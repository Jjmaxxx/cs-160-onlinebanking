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

def update_user_info(user_id: int, first_name: str = None, last_name: str = None, address: str = None, zip_code: str = None, state: str = None, city: str = None):
    """
    Update user information in the database.
    """
    query = '''
        UPDATE users 
        SET first_name = %s, last_name = %s, address = %s, zip_code = %s, state = %s, city = %s 
        WHERE id = %s;
    '''
    values = (first_name, last_name, address, zip_code, state, city, user_id)
    
    # Filter out None values to avoid SQL errors
    values = tuple(v if v is not None else fetch_one('SELECT {} FROM users WHERE id = %s'.format(k), (user_id,)) for k,v in zip(['first_name', 'last_name', 'address', 'zip_code', 'state', 'city'], values)) + (user_id,)

    logger().debug("Updating user info for with values: %s", values)
 
    return execute_query(query, values)

def get_user_accounts(user_id: int):
    """
    Retrieve all accounts for a given user that are open.
    """
    query = '''
        SELECT * FROM accounts
        WHERE user_id = %s AND account_status = 'active';
    '''

    logger().debug("Fetching accounts for user_id: %s", user_id)

    accounts = fetch_all(query, (user_id,))

    if not accounts:
        logger().debug("No active accounts found for user_id: %s", user_id)

    return accounts

def user_id_by_email(email: str):
    """
    Retrieve the user ID by email address.
    """
    query = '''
        SELECT id FROM users
        WHERE email = %s;
    '''
    
    logger().debug("Fetching user ID for email: %s", email)
    
    user = fetch_one(query, (email,))
    
    if not user:
        logger().debug("No user found for email: %s", email)
        return None
    
    logger().debug("Found user ID: %s for email: %s", user['id'], email)
    
    return user['id']

CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

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

CREATE TABLE IF NOT EXISTS reports(
	id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_text TEXT,
    FOREIGN KEY (manager_id) REFERENCES bank_managers(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS accounts(
	id INT AUTO_INCREMENT PRIMARY KEY,
    account_number BIGINT UNSIGNED UNIQUE,
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



DELIMITER $$

CREATE TRIGGER assign_account_number
BEFORE INSERT ON accounts
FOR EACH ROW
BEGIN
    DECLARE num_digits INT;
    DECLARE min_value BIGINT;
    DECLARE max_value BIGINT;
    DECLARE random_number BIGINT;
    SET num_digits = FLOOR(8 + (RAND() * 5)); -- 8, 9, 10, 11, 12
    SET min_value = POWER(10, num_digits - 1);
    SET max_value = (POWER(10, num_digits) - 1);
    SET random_number = FLOOR(min_value + (RAND() * (max_value - min_value + 1)));
    SET NEW.account_number = random_number;
END$$

DELIMITER ;

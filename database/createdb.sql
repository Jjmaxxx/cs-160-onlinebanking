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
    account_number BIGINT UNSIGNED UNIQUE,
    user_id INT,
    account_type ENUM('savings', 'checking') DEFAULT 'checking',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    interest_rate DECIMAL(5, 2),
    account_status ENUM('active', 'closed') DEFAULT 'active',
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


-- Insert dummy data into users table
INSERT IGNORE INTO users (email, first_name, last_name, address, zip_code, state, city)
VALUES
('user1@example.com', 'User1', 'Last1', 'Address1', '10001', 'NY', 'New York'),
('user2@example.com', 'User2', 'Last2', 'Address2', '10000', 'CA', 'Los Angeles'),
('user3@example.com', 'User3', 'Last3', 'Address3', '10011', 'TX', 'Houston'),
('user4@example.com', 'User4', 'Last4', 'Address4', '10000', 'FL', 'Miami'),
('user5@example.com', 'User5', 'Last5', 'Address5', '10000', 'IL', 'Chicago'),
('user6@example.com', 'User6', 'Last6', 'Address6', '10006', 'WA', 'Seattle'),
('user7@example.com', 'User7', 'Last7', 'Address7', '10006', 'NV', 'Las Vegas'),
('user8@example.com', 'User8', 'Last8', 'Address8', '10006', 'AZ', 'Phoenix'),
('user9@example.com', 'User9', 'Last9', 'Address9', '10000', 'CO', 'Denver'),
('user10@example.com', 'User10', 'Last10', 'Address10', '10010', 'GA', 'Atlanta'),
('user11@example.com', 'User11', 'Last11', 'Address11', '10011', 'MA', 'Boston'),
('user12@example.com', 'User12', 'Last12', 'Address12', '10011', 'PA', 'Philadelphia'),
('user13@example.com', 'User13', 'Last13', 'Address13', '10011', 'OH', 'Columbus'),
('user14@example.com', 'User14', 'Last14', 'Address14', '10014', 'MI', 'Detroit'),
('user15@example.com', 'User15', 'Last15', 'Address15', '10014', 'NC', 'Charlotte'),
('user16@example.com', 'User16', 'Last16', 'Address16', '10010', 'OR', 'Portland'),
('user17@example.com', 'User17', 'Last17', 'Address17', '10017', 'TN', 'Nashville'),
('user18@example.com', 'User18', 'Last18', 'Address18', '10017', 'MO', 'St. Louis'),
('user19@example.com', 'User19', 'Last19', 'Address19', '10019', 'WI', 'Milwaukee'),
('user20@example.com', 'User20', 'Last20', 'Address20', '10020', 'MN', 'Minneapolis');

-- Insert dummy data into accounts table
INSERT IGNORE INTO accounts (user_id, account_type, balance, account_status)
VALUES
(1, 'savings', 1000.75, 'active'), (1, 'checking', 500.50, 'active'), (1, 'savings', 1500.25, 'active'), (1, 'checking', 2000.80, 'active'), (1, 'savings', 2500.60, 'active'),
(2, 'checking', 500.45, 'active'), (3, 'savings', 2000.30, 'active'), (4, 'checking', 1500.90, 'active'),
(5, 'savings', 3000.15, 'active'), (6, 'checking', 2500.70, 'active'), (7, 'savings', 4000.85, 'active'),
(8, 'checking', 3500.95, 'active'), (9, 'savings', 5000.40, 'active'), (10, 'checking', 4500.25, 'active'),
(11, 'savings', 6000.10, 'active'), (12, 'checking', 5500.55, 'active'), (13, 'savings', 7000.35, 'active'),
(14, 'checking', 6500.20, 'active'), (15, 'savings', 8000.75, 'active'), (16, 'checking', 7500.60, 'active'),
(17, 'savings', 9000.50, 'active'), (18, 'checking', 8500.45, 'active'), (19, 'savings', 10000.80, 'active'),
(20, 'checking', 9500.95, 'active');

-- Insert dummy data into transactions table
INSERT IGNORE INTO transactions (account_id, transaction_type, amount, transaction_status, destination_account_id)
VALUES
(1, 'deposit', 750.00, 'completed', NULL), (2, 'withdrawal', 120.00, 'completed', NULL),
(3, 'transfer', 300.00, 'completed', 5), (4, 'deposit', 450.00, 'completed', NULL),
(5, 'withdrawal', 220.00, 'completed', NULL), (6, 'transfer', 600.00, 'completed', 8),
(7, 'deposit', 800.00, 'completed', NULL), (8, 'withdrawal', 350.00, 'completed', NULL),
(9, 'transfer', 900.00, 'completed', 2), (10, 'deposit', 1000.00, 'completed', NULL),
(11, 'withdrawal', 150.00, 'completed', NULL), (12, 'transfer', 250.00, 'completed', 7),
(13, 'deposit', 1300.00, 'completed', NULL), (14, 'withdrawal', 400.00, 'completed', NULL),
(15, 'transfer', 500.00, 'completed', 10), (16, 'deposit', 1700.00, 'completed', NULL),
(17, 'withdrawal', 600.00, 'completed', NULL), (18, 'transfer', 800.00, 'completed', 3),
(19, 'deposit', 2000.00, 'completed', NULL), (20, 'withdrawal', 950.00, 'completed', NULL),
(1, 'transfer', 450.00, 'completed', 4), (3, 'withdrawal', 300.00, 'completed', NULL),
(5, 'deposit', 1200.00, 'completed', NULL), (7, 'transfer', 700.00, 'completed', 9),
(9, 'withdrawal', 500.00, 'completed', NULL), (11, 'transfer', 600.00, 'completed', 6),
(13, 'deposit', 1800.00, 'completed', NULL), (15, 'withdrawal', 700.00, 'completed', NULL),
(17, 'transfer', 900.00, 'completed', 12), (19, 'deposit', 2500.00, 'completed', NULL),
(2, 'transfer', 300.00, 'completed', 14), (4, 'withdrawal', 200.00, 'completed', NULL),
(6, 'deposit', 1400.00, 'completed', NULL), (8, 'transfer', 1000.00, 'completed', 16),
(10, 'withdrawal', 800.00, 'completed', NULL), (12, 'transfer', 1200.00, 'completed', 18),
(14, 'deposit', 2200.00, 'completed', NULL), (16, 'withdrawal', 900.00, 'completed', NULL),
(18, 'transfer', 1500.00, 'completed', 20), (20, 'deposit', 3000.00, 'completed', NULL);

-- Insert dummy data into bill_payments table
INSERT IGNORE INTO bill_payments (payee_name, payee_account_id, amount, bill_status)
VALUES
('Payee 1', 1, 100.00, 'completed'), ('Payee 2', 2, 200.00, 'pending'),
('Payee 3', 3, 300.00, 'completed'), ('Payee 4', 4, 400.00, 'pending'),
('Payee 5', 5, 500.00, 'completed'), ('Payee 6', 6, 600.00, 'pending'),
('Payee 7', 7, 700.00, 'completed'), ('Payee 8', 8, 800.00, 'pending'),
('Payee 9', 9, 900.00, 'completed'), ('Payee 10', 10, 1000.00, 'pending'),
('Payee 11', 11, 1100.00, 'completed'), ('Payee 12', 12, 1200.00, 'pending'),
('Payee 13', 13, 1300.00, 'completed'), ('Payee 14', 14, 1400.00, 'pending'),
('Payee 15', 15, 1500.00, 'completed'), ('Payee 16', 16, 1600.00, 'pending'),
('Payee 17', 17, 1700.00, 'completed'), ('Payee 18', 18, 1800.00, 'pending'),
('Payee 19', 19, 1900.00, 'completed'), ('Payee 20', 20, 2000.00, 'pending');

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

CREATE TRIGGER set_interest_rate
BEFORE INSERT ON accounts
FOR EACH ROW
BEGIN
    IF NEW.account_type = 'checking' THEN
        SET NEW.interest_rate = 0.01;
    ELSEIF NEW.account_type = 'savings' THEN
        SET NEW.interest_rate = 1.25;
    END IF;
END$$

DELIMITER ;

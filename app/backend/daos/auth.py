from db import execute_query, fetch_one

def add_user(email:str):
    execute_query('''
        INSERT IGNORE INTO users (email)
        VALUES (%s);
    ''', (email,))


def get_user(email: str):
    user = fetch_one('''
        SELECT * FROM users
        WHERE email = %s;
    ''', (email,))
    return user
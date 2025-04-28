from db import execute_query, fetch_one

def add_user(email:str, first_name:str, last_name:str):

    execute_query('''
        INSERT INTO users (email, first_name, last_name)
        VALUES (%s, %s, %s);
    ''', (email, first_name, last_name))


def get_user(email: str):
    user = fetch_one('''
        SELECT * FROM users
        WHERE email = %s;
    ''', (email,))
    return user
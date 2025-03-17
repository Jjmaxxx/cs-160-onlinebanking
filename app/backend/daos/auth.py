from db import execute_query

def add_user_to_db(email:str):
    execute_query('''
        INSERT IGNORE INTO users (email)
        VALUES (%s);
    ''', (email,))
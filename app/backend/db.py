import mysql.connector
from flask import g

def get_db_connection():
    if 'db_connection' not in g:
        g.db_connection = mysql.connector.connect(
            host='db',
            database='banking_db',
            user='root',
            password='password',
            port=3306
        )
    return g.db_connection

def execute_query(query, params=None):
    if params is None:
        params = ()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
    except mysql.connector.Error as e:
        print(f"DatabaseError: {e}")
    finally:
        cursor.close()

def fetch_one(query, params=None):
    if params is None:
        params = ()
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params)
        return cursor.fetchone()
    except mysql.connector.Error as e:
        print(f"DatabaseError: {e}")
    finally:
        cursor.close()

def fetch_all(query, params=None):
    if params is None:
        params = ()
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, params)
        return cursor.fetchall()
    except mysql.connector.Error as e:
        print(f"DatabaseError: {e}")
    finally:
        cursor.close()

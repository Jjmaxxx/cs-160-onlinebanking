import flask
import mysql.connector
from mysql.connector import InternalError
from views import auth


## Connect to db
def connect_to_db():
    try:
        connection = mysql.connector.connect(
            host = 'db',            # name same as docker-compose.yml
            database = 'banking_db',
            user="root",  # Use the root user
            password="password",  # default, used to access database with `mysql -u root -p` then input 'password'
            port = 3306             # default port for mysql, must match with docker-compose.yml
        )
        return connection
    except mysql.connector.Error as e:
        print(f"MySQL Error: {e}")
    except Exception as e:
        print (f"Non-MySQL Error: {e}")
    
    return None

## TEMPORARY DATA; REMOVE WHEN WE GET REAL DATA OR WHEN ADMIN CAN ADD FAKE DATA
try:
    connect_to_db().get_rows()
except InternalError:
    connection = connect_to_db()
    cursor = connection.cursor()
    cursor.execute(
     '''INSERT INTO users (email, first_name, last_name, address, zip_code, state, city) VALUES
        ('alice@example.com', 'Alice', 'Johnson', '123 Maple St', '94102', 'CA', 'San Francisco'),
        ('bob@example.com', 'Bob', 'Smith', '456 Oak St', '10001', 'NY', 'New York'),
        ('charlie@example.com', 'Charlie', 'Brown', '789 Pine St', '60601', 'IL', 'Chicago'),
        ('diana@example.com', 'Diana', 'Lopez', '321 Birch St', '90001', 'CA', 'Los Angeles'),
        ('eric@example.com', 'Eric', 'Wang', '654 Cedar St', '77001', 'TX', 'Houston');'''
    )
    connection.commit()
    cursor.close()
    connection.close()



app = flask.Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')

# @app.route('/')
# def index():
#     connection = connect_to_db()
#     cursor = connection.cursor(dictionary=True)

#     # get all users
#     cursor.execute("SELECT * FROM users")
#     query = cursor.fetchall()

#     cursor.close()
#     connection.close()

#     # display users
#     return {"users": query}

if __name__ == '__main__':
    app.run(debug=True, port=12094)
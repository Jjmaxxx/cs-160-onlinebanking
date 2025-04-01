from flask import current_app

def logger():
    return current_app.logger

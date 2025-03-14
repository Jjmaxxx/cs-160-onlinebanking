from flask import Blueprint
from app.services import google_login

auth = Blueprint('auth', __name__)

@auth.route('/google/login')
def login():
    return "This is the flagged reviews page"

@auth.route('/google/callback')
def callback():
    return "This is the flagged reviews page"


@auth.route('/logout')
def logout():
    return "This is the flagged comments page"
from flask import Blueprint
from app.services import google_authorize_service, google_callback_service

auth = Blueprint('auth', __name__)

@auth.route('/google/login')
def authorize():
    return google_authorize_service()

@auth.route('/google/callback')
def callback():
    return google_callback_service()


@auth.route('/logout')
def logout():
    return "This is the flagged comments page"
import flask
from flask import jsonify
import google_auth_oauthlib.flow
import requests
import google.oauth2.credentials
import os
from urllib.parse import urlparse
from dotenv import load_dotenv  
load_dotenv()
from daos.auth import add_user

CLIENT_SECRETS_FILE = '/workdir/app/backend/client_secret.json'
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'granted_scopes': credentials.granted_scopes}

def get_user_info(token):
    url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    response = requests.get(url, headers=headers).json()
    return response
def google_authorize_service():
    port = flask.request.args.get('port', default=3000, type=int)
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(CLIENT_SECRETS_FILE,
    scopes=SCOPES)
    flow.redirect_uri = flask.url_for('auth.callback', _external=True)
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    flask.session['state'] = state
    flask.session['port'] = port
    return flask.redirect(authorization_url)

def google_callback_service():
    state = flask.session['state']
    port = flask.session.get('port', 3000)
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = flask.url_for('auth.callback', _external=True)

    authorization_response = flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    credentials = flow.credentials
    
    credentials = credentials_to_dict(credentials)

    flask.session['credentials'] = credentials
    access_token = credentials.get('token')
    user_info = get_user_info(access_token)
    email: str = user_info.get("email")
    first_name: str = user_info.get("given_name")
    last_name: str = user_info.get("family_name")
    add_user(email, first_name, last_name)
    url = f"http://localhost:{port}"
    response = flask.make_response(flask.redirect(url))
    response.set_cookie('access_token', access_token)
    return response


def logout_user():
    response = flask.make_response(jsonify({"message": "User logged out successfully"}))
    response.set_cookie('access_token', '', expires=0)
    response.set_cookie('session', '', expires=0)
    
    return response
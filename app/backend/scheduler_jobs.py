from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from daos.account import transfer_funds, get_bill_payments_today, set_bill_payment_status
from flask_apscheduler import APScheduler
from flask import Flask
from db import get_db_connection

scheduler = APScheduler()

def run_task_with_app_context(app):
    with app.app_context():
        get_db_connection()
        bills = get_bill_payments_today() or []
        for bill in bills:
            bill_id = bill['id']
            try:
                success = transfer_funds(bill['payee_account_id'], bill['destination_account_id'],bill['amount'])
                if success:
                    set_bill_payment_status(bill_id, "completed")
                    
            except Exception as e:
                set_bill_payment_status(bill_id, "failed")

# @scheduler.task('interval', id='every_second_task', seconds=1)
@scheduler.task('interval', id='daily_bill', hours=1)
def daily_bill():
    app = Flask(__name__)
    run_task_with_app_context(app)

def start_scheduler(app: Flask):
    scheduler.init_app(app)
    scheduler.start()

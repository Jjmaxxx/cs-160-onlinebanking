import os
from PIL import Image
from dotenv import load_dotenv
import io
import requests
from services.utils import (
    extract_check_amount
)
from daos.account import (
    deposit_to_account,
)

def read_check(account_id, check_image):
    try:
        image = Image.open(io.BytesIO(check_image.read()))
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        response = requests.post('https://api.ocr.space/parse/image', data={'apikey': os.getenv('OCR_API_KEY')}, files={'filename': ('check.png', img_byte_arr, 'image/png')})
        result = response.json()
        text = result['ParsedResults'][0]['ParsedText']
        amount = extract_check_amount("".join(text))
        if amount is not None:
            deposit_to_account(int(account_id), float(amount))
            return amount
        return None
    except Exception as e:
        print("No text detected.")
        return None
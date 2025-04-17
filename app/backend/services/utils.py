import re
def extract_check_amount(text):
    print(text)
    match = re.search(r'\$\s?((?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?)', text)
    if match:
        return match.group(1)
    return None
import os
import json
from datetime import datetime
from core.config import DATA_DIR

HISTORY_FILE = os.path.join(DATA_DIR, 'history.json')

def get_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_history(history_list):
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history_list, f, indent=4)

def add_entry(title, url, format_type):
    history = get_history()
    history.insert(0, {
        "title": title,
        "url": url,
        "format": format_type,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    save_history(history)
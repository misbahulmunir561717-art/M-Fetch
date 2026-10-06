import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
SETTINGS_FILE = os.path.join(DATA_DIR, 'settings.json')

def get_settings():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, 'r') as f:
            return json.load(f)
    return {
        "download_dir": os.path.join(os.path.expanduser("~"), "Downloads", "MFetch"),
        "resolution": "1080"
    }

def save_settings(data):
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(data, f, indent=4)
import requests
import json
import time

POCKETBASE_URL = "http://loom-pocketbase:8090"

def init_db():
    print("Initializing PocketBase Schema...")
    schema = {
        "id": "conductor_state",
        "name": "conductor_state",
        "type": "base",
        "system": False,
        "schema": [
            {
                "system": False,
                "id": "state_data_field",
                "name": "state_data",
                "type": "json",
                "required": True,
                "presentable": False,
                "unique": False,
                "options": {
                    "maxSize": 2000000
                }
            }
        ],
        "listRule": "",
        "viewRule": "",
        "createRule": "",
        "updateRule": "",
        "deleteRule": ""
    }
    
    # Check if collection exists
    try:
        url = f"{POCKETBASE_URL}/api/collections/conductor_state"
        resp = requests.get(url, timeout=2)
        if resp.status_code == 200:
            print("Collection exists. Updating schema...")
            update_url = f"{POCKETBASE_URL}/api/collections/conductor_state"
            resp = requests.patch(update_url, json=schema, timeout=2)
        else:
            print("Collection does not exist. Creating...")
            create_url = f"{POCKETBASE_URL}/api/collections"
            resp = requests.post(create_url, json=schema, timeout=2)
            
        if resp.status_code >= 400:
            print(f"Error creating/updating schema: {resp.text}")
        else:
            print("Schema initialized successfully.")
    except Exception as e:
        print(f"PocketBase not reachable for init: {e}")

if __name__ == "__main__":
    init_db()

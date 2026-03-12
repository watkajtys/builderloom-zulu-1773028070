import requests
import json
import time

import os
POCKETBASE_URL = os.environ.get("POCKETBASE_URL", "http://127.0.0.1:8090")

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
            print(f"Error creating/updating conductor_state schema: {resp.text}")
        else:
            print("conductor_state schema initialized successfully.")

        # Initialize repo_memory collection
        memory_schema = {
            "id": "repo_memory_col",
            "name": "repo_memory",
            "type": "base",
            "system": False,
            "schema": [
                {
                    "system": False,
                    "name": "raw_learnings",
                    "type": "text",
                    "required": False,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                },
                {
                    "system": False,
                    "name": "compressed_context",
                    "type": "text",
                    "required": False,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                },
                {
                    "system": False,
                    "name": "last_compressed_at",
                    "type": "date",
                    "required": False,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                }
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        }
        
        memory_url = f"{POCKETBASE_URL}/api/collections/repo_memory"
        resp = requests.get(memory_url, timeout=2)
        if resp.status_code == 200:
            print("repo_memory collection exists. Updating schema...")
            resp = requests.patch(memory_url, json=memory_schema, timeout=2)
        else:
            print("repo_memory collection does not exist. Creating...")
            create_url = f"{POCKETBASE_URL}/api/collections"
            resp = requests.post(create_url, json=memory_schema, timeout=2)
            
        if resp.status_code >= 400:
            print(f"Error creating/updating repo_memory schema: {resp.text}")
        else:
            print("repo_memory schema initialized successfully.")

        # Initialize kanban_tasks collection
        kanban_schema = {
            "id": "kanban_tasks_id",
            "name": "kanban_tasks",
            "type": "base",
            "system": False,
            "schema": [
                {
                    "system": False,
                    "name": "title",
                    "type": "text",
                    "required": True,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                },
                {
                    "system": False,
                    "name": "status",
                    "type": "text",
                    "required": True,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                },
                {
                    "system": False,
                    "name": "order_index",
                    "type": "number",
                    "required": True,
                    "presentable": False,
                    "unique": False,
                    "options": {}
                }
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        }
        
        kanban_url = f"{POCKETBASE_URL}/api/collections/kanban_tasks"
        resp = requests.get(kanban_url, timeout=2)
        if resp.status_code == 200:
            print("kanban_tasks collection exists. Updating schema...")
            resp = requests.patch(kanban_url, json=kanban_schema, timeout=2)
        else:
            print("kanban_tasks collection does not exist. Creating...")
            create_url = f"{POCKETBASE_URL}/api/collections"
            resp = requests.post(create_url, json=kanban_schema, timeout=2)
            
        if resp.status_code >= 400:
            print(f"Error creating/updating kanban_tasks schema: {resp.text}")
        else:
            print("kanban_tasks schema initialized successfully.")

    except Exception as e:
        print(f"PocketBase not reachable for init: {e}")

if __name__ == "__main__":
    init_db()

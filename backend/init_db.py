import logging
import os
import requests

logger = logging.getLogger("loom")

def init_core_collections():
    """Initializes the core data model for state persistence using standard REST API."""
    logger.info("Initializing PocketBase collections for Conductor State and Repo Memory via Admin REST API...")
    
    pb_host = os.getenv("PB_HOSTNAME", "loom-pocketbase")
    pb_url = f"http://{pb_host}:8090"
    
    admin_email = "admin@loom.local"
    admin_password = os.environ.get("PB_ADMIN_PASSWORD", "loom_secure_password")
    
    # Authenticate via Admin API
    token = None
    # Try Modern v0.23+ and Legacy endpoints
    auth_endpoints = [
        f"{pb_url}/api/collections/_superusers/auth-with-password",
        f"{pb_url}/api/admins/auth-with-password"
    ]
    
    for endpoint in auth_endpoints:
        try:
            resp = requests.post(endpoint, json={"identity": admin_email, "password": admin_password}, timeout=5)
            if resp.status_code == 200:
                token = resp.json().get("token")
                break
        except Exception:
            pass
            
    if not token:
        logger.error("Failed to authenticate as PocketBase Superuser/Admin.")
        return False

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Note: JSON fields require an options object with maxSize. Empty strings for rules enable public access.
    schema = [
        {
            "name": "conductor_state",
            "type": "base",
            "schema": [
                { "name": "active_phase", "type": "text" },
                { "name": "status", "type": "text" },
                { "name": "current_task_id", "type": "text" },
                { "name": "iteration", "type": "number" }
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        },
        {
            "name": "repo_memory",
            "type": "base",
            "schema": [
                { "name": "type", "type": "text" },
                { "name": "content", "type": "json", "options": {"maxSize": 2000000} },
                { "name": "is_compressed", "type": "bool" }
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        }
    ]

    success = True
    
    # Get existing collections
    existing = {}
    try:
        resp = requests.get(f"{pb_url}/api/collections?page=1&perPage=100", headers=headers, timeout=5)
        if resp.status_code == 200:
            for item in resp.json().get("items", []):
                existing[item["name"]] = item["id"]
        else:
            logger.error(f"Failed to fetch collections: {resp.status_code}")
            return False
    except Exception as e:
        logger.error(f"Failed to fetch collections: {e}")
        return False

    for collection in schema:
        name = collection["name"]
        try:
            if name in existing:
                col_id = existing[name]
                resp = requests.patch(f"{pb_url}/api/collections/{col_id}", json=collection, headers=headers, timeout=5)
                if resp.status_code == 200:
                    logger.info(f"Successfully updated collection '{name}'.")
                else:
                    logger.error(f"Failed to update collection '{name}': {resp.status_code} {resp.text}")
                    success = False
            else:
                resp = requests.post(f"{pb_url}/api/collections", json=collection, headers=headers, timeout=5)
                if resp.status_code == 200:
                    logger.info(f"Successfully created collection '{name}'.")
                else:
                    logger.error(f"Failed to create collection '{name}': {resp.status_code} {resp.text}")
                    success = False
        except Exception as e:
            logger.error(f"Exception while provisioning '{name}': {e}")
            success = False
            
    if success:
        logger.info("Successfully provisioned core state collections.")
    else:
        logger.error("Failed to provision core state collections.")
        
    return success

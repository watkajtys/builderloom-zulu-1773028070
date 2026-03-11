import logging
import os
import requests

logger = logging.getLogger("loom")

def init_core_collections():
    """Initializes the core data model for state persistence using standard REST API."""
    logger.info("Initializing PocketBase collections for Conductor State and Repo Memory via Admin REST...")
    
    # PocketBase SDK
    import pocketbase
    pb_host = os.getenv("PB_HOSTNAME", "loom-pocketbase")
    pb_url = f"http://{pb_host}:8090"
    client = pocketbase.PocketBase(pb_url)
    
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

    client.auth_store.save(token, None)

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
    
    # Get existing collections via SDK
    try:
        existing_items = client.collections.get_full_list()
        existing = {item.name: item.id for item in existing_items}
    except Exception as e:
        logger.error(f"Failed to fetch collections: {e}")
        return False

    for collection in schema:
        name = collection["name"]
        try:
            if name in existing:
                col_id = existing[name]
                client.collections.update(col_id, collection)
                logger.info(f"Successfully updated collection '{name}'.")
            else:
                client.collections.create(collection)
                logger.info(f"Successfully created collection '{name}'.")
        except Exception as e:
            logger.error(f"Exception while provisioning '{name}': {e}")
            success = False
            
    if success:
        logger.info("Successfully provisioned core state collections.")
    else:
        logger.error("Failed to provision core state collections.")
        
    return success

import requests
import json
import time
import os

pb_url = "http://loom-pocketbase:8090"
admin_email = "admin@loom.local"
admin_password = "loom_secure_password"

# Attempt to create admin
try:
    requests.post(f"{pb_url}/api/admins", json={
        "email": admin_email,
        "password": admin_password,
        "passwordConfirm": admin_password
    })
except Exception:
    pass

import sys
sys.path.append('.')
from backend.init_db import init_core_collections
init_core_collections()


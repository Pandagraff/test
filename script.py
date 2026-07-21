import requests
import json

webhook_url = "https://discord.com/api/webhooks/1529208015012630702/HveqdutUCutYWro6Eu3eglbSqa9a33T1ejzx_QGro5U93DGTd7mo_SmP0AiPbv1yer9k"

payload = {
    "content": "Do your dailies!",
    "username": "Reminder"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(webhook_url, data=json.dumps(payload), headers=headers)
print(response.status_code)
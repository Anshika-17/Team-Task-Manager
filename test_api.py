import requests

# 1. Register a user
res = requests.post("http://localhost:8000/api/auth/register", json={
    "name": "Test User",
    "email": "test10@example.com",
    "password": "password123",
    "role": "member"
})
print("Register:", res.status_code, res.text)

# 2. Login
res = requests.post("http://localhost:8000/api/auth/login", data={
    "username": "test10@example.com",
    "password": "password123"
})
print("Login:", res.status_code)
token = res.json().get("access_token")

# 3. Create Project
res = requests.post("http://localhost:8000/api/projects", json={
    "name": "My Project",
    "description": "Desc"
}, headers={"Authorization": f"Bearer {token}"})
print("Create Project:", res.status_code, res.text)

# 4. Create Task
project_id = res.json().get("id")
res = requests.post(f"http://localhost:8000/api/projects/{project_id}/tasks", json={
    "title": "My Task"
}, headers={"Authorization": f"Bearer {token}"})
print("Create Task:", res.status_code, res.text)

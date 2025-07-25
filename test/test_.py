import requests
import configparser
import uuid

config = configparser.ConfigParser()
config.read("../Backend/config.prd.ini")
port = 9000

def check_success(response):
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 0, f"Expected code 0, but got {data['code']} with message: {data.get('message')}"

def login(param = None):
    url = f"http://localhost:{port}/login"
    if param is None:
        param = {"username": "tyrion", "password": "12345678"}
    response = requests.post(url, json=param)
    check_success(response)
    data = response.json()
    token = data["data"].get("access_token")
    return token

def get_my_profile(token):
    url = f"http://localhost:{port}/my_profile"
    response = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    check_success(response)
    return response


def profile_edit(token):
    url = f"http://localhost:{port}/profile_edit"
    param = {"height":100,"age":100,"weight":100}
    response = requests.put(url, json=param,headers={"Authorization": f"Bearer {token}"})
    check_success(response)

def delete_profile(token,param):
    url = f"http://localhost:{port}/profile_delete"
    param ={"username":"testing"}
    response = requests.post(url, json=param, headers={"Authorization": f"Bearer {token}"})
    check_success(response)

def test_login():
    token = login()
    assert token is not None

def test_get_my_profile():
    url = f"http://localhost:{port}/my_profile"
    token = login()
    response = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    check_success(response)



def test_profile_add():
    url = f"http://localhost:{port}/register"
    unique_username = "testing_" + str(uuid.uuid4())[:8]
    param = {"username": unique_username, "password": "testing"}
    response = requests.post(url, json=param)
    check_success(response)
    token = login(param)
    delete_profile(token,param)

def test_profile_edit():
    url = f"http://localhost:{port}/profile_edit"
    token = login()
    param = {"height":1,"age":1,"weight":1}
    response = requests.put(url, json=param,headers={"Authorization": f"Bearer {token}"})
    check_success(response)

    new_response =  get_my_profile(token)
    new_response = new_response.json()
    assert new_response["data"][0]["height"] == 1
    assert new_response["data"][0]["age"] == 1
    assert new_response["data"][0]["weight"] == 1
    profile_edit(token)
    new_response =  get_my_profile(token)
    new_response = new_response.json()
    assert new_response["data"][0]["height"] == 100
    assert new_response["data"][0]["age"] == 100
    assert new_response["data"][0]["weight"] == 100

def test_nutrition_update():
    url = f"http://localhost:{port}/nutrition_add"
    token = login()
    param = {
        "food": "Grilled Chicken Breast",
        "timestamp":"2025-07-12T14:32:45",
        "quantity": 150.5,
        "nutrients": {
        "protein": 31.2,
        "carbs": 0,
        "fat": 3.6,
        "calories": 165,
        "fiber": 0,
        "sugar": 0,
        "sodium": 74
    }
}
    response = requests.put(url, json=param, headers={"Authorization": f"Bearer {token}"})
    check_success(response)

def test_retrieve_log():
    token = login()
    url = f"http://localhost:{port}/retrieve_log"
    response = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    check_success(response)

def test_delete_log():
    token = login()
    url = f"http://localhost:{port}/delete_log"
    param = {
        "timestamp":"2025-07-12T14:32:45",
        "food": "Grilled Chicken Breast",
    }
    response = requests.post(url, json=param, headers={"Authorization": f"Bearer {token}"})
    check_success(response)

def test_dv_summation():
    token = login()
    url = f"http://localhost:{port}/dv_summation"
    response = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    check_success(response)

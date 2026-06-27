class TestAuth:
    def test_register(self, client):
        r = client.post("/api/auth/register", json={"username": "newuser", "email": "n@e.com", "password": "secure123"})
        assert r.status_code == 200
        assert "access_token" in r.json()

    def test_register_dup(self, client):
        client.post("/api/auth/register", json={"username": "dup", "email": "d@e.com", "password": "pass1234"})
        r = client.post("/api/auth/register", json={"username": "dup", "email": "d2@e.com", "password": "pass1234"})
        assert r.status_code == 400

    def test_login(self, client):
        client.post("/api/auth/register", json={"username": "lu", "email": "l@e.com", "password": "pass1234"})
        r = client.post("/api/auth/login", json={"username": "lu", "password": "pass1234"})
        assert r.status_code == 200 and "access_token" in r.json()

    def test_login_wrong(self, client):
        client.post("/api/auth/register", json={"username": "u2", "email": "u2@e.com", "password": "pass1234"})
        assert client.post("/api/auth/login", json={"username": "u2", "password": "wrong"}).status_code == 401

    def test_refresh(self, client):
        reg = client.post("/api/auth/register", json={"username": "ru", "email": "r@e.com", "password": "pass1234"}).json()
        r = client.post("/api/auth/refresh", json={"refresh_token": reg["refresh_token"]})
        assert r.status_code == 200

    def test_me(self, client, auth_headers):
        assert client.get("/api/auth/me", headers=auth_headers).status_code == 200

    def test_me_unauth(self, client):
        assert client.get("/api/auth/me").status_code == 401

class TestAuth:
    def test_register(self, client):
        r = client.post("/api/auth/register", json={"username": "newuser99", "email": "n99@e.com", "password": "secure123"})
        assert r.status_code == 200
        assert "access_token" in r.json()

    def test_register_dup(self, client):
        client.post("/api/auth/register", json={"username": "dupuser99", "email": "d99@e.com", "password": "pass1234"})
        r = client.post("/api/auth/register", json={"username": "dupuser99", "email": "d98@e.com", "password": "pass1234"})
        assert r.status_code == 400

    def test_login(self, client):
        client.post("/api/auth/register", json={"username": "loginuser99", "email": "l99@e.com", "password": "pass1234"})
        r = client.post("/api/auth/login", json={"username": "loginuser99", "password": "pass1234"})
        assert r.status_code == 200 and "access_token" in r.json()

    def test_login_wrong(self, client):
        client.post("/api/auth/register", json={"username": "user29999", "email": "u299@e.com", "password": "pass1234"})
        assert client.post("/api/auth/login", json={"username": "user29999", "password": "wrong"}).status_code == 401

    def test_refresh(self, client):
        reg = client.post("/api/auth/register", json={"username": "refuser99", "email": "r99@e.com", "password": "pass1234"}).json()
        r = client.post("/api/auth/refresh", json={"refresh_token": reg["refresh_token"]})
        assert r.status_code == 200

    def test_me(self, client, auth_headers):
        assert client.get("/api/auth/me", headers=auth_headers).status_code == 200

    def test_me_unauth(self, client):
        assert client.get("/api/auth/me").status_code == 401

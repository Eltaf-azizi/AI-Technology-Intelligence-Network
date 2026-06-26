class TestAuth:
    def test_register(self, client):
        r = client.post("/api/auth/register", json={"username": "newuser", "email": "new@example.com", "password": "securepass123"})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d and "refresh_token" in d

    def test_register_duplicate(self, client):
        client.post("/api/auth/register", json={"username": "dup", "email": "d@e.com", "password": "pass1234"})
        r = client.post("/api/auth/register", json={"username": "dup", "email": "d2@e.com", "password": "pass1234"})
        assert r.status_code == 400

    def test_register_short_password(self, client):
        r = client.post("/api/auth/register", json={"username": "u", "email": "u@e.com", "password": "12"})
        assert r.status_code == 422

    def test_login(self, client):
        client.post("/api/auth/register", json={"username": "loginuser", "email": "l@e.com", "password": "pass1234"})
        r = client.post("/api/auth/login", json={"username": "loginuser", "password": "pass1234"})
        assert r.status_code == 200
        assert "access_token" in r.json()

    def test_login_wrong(self, client):
        client.post("/api/auth/register", json={"username": "u2", "email": "u2@e.com", "password": "pass1234"})
        r = client.post("/api/auth/login", json={"username": "u2", "password": "wrong"})
        assert r.status_code == 401

    def test_login_nonexistent(self, client):
        r = client.post("/api/auth/login", json={"username": "nobody", "password": "x"})
        assert r.status_code == 401

    def test_refresh(self, client):
        reg = client.post("/api/auth/register", json={"username": "refuser", "email": "r@e.com", "password": "pass1234"}).json()
        r = client.post("/api/auth/refresh", json={"refresh_token": reg["refresh_token"]})
        assert r.status_code == 200

    def test_refresh_invalid(self, client):
        r = client.post("/api/auth/refresh", json={"refresh_token": "bad.token.here"})
        assert r.status_code == 401

    def test_me_auth(self, client, auth_headers):
        r = client.get("/api/auth/me", headers=auth_headers)
        assert r.status_code == 200

    def test_me_unauth(self, client):
        r = client.get("/api/auth/me")
        assert r.status_code == 401

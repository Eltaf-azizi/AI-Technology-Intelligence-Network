class TestUsers:
    def test_progress_auth(self, client, auth_headers):
        assert client.get("/api/users/progress", headers=auth_headers).status_code == 200

    def test_progress_unauth(self, client):
        assert client.get("/api/users/progress").status_code == 401

    def test_update_progress(self, client, auth_headers):
        r = client.post("/api/users/progress", json={"technology_slug": "python", "status": "in_progress", "score": 50}, headers=auth_headers)
        assert r.status_code == 200 and r.json()["status"] == "in_progress"

    def test_save_path(self, client, auth_headers):
        r = client.post("/api/users/saved-paths", params={"title": "Path", "goal": "Goal"}, json={"path_data": {"steps": []}}, headers=auth_headers)
        assert r.status_code == 200

    def test_audit_logs(self, client, auth_headers):
        r = client.get("/api/users/audit-logs", headers=auth_headers)
        assert r.status_code == 200

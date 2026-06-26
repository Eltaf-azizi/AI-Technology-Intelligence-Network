class TestUsers:
    def test_progress_auth(self, client, auth_headers):
        r = client.get("/api/users/progress", headers=auth_headers)
        assert r.status_code == 200

    def test_progress_unauth(self, client):
        assert client.get("/api/users/progress").status_code == 401

    def test_update_progress(self, client, auth_headers):
        r = client.post("/api/users/progress", json={"technology_slug": "python", "status": "in_progress", "score": 50}, headers=auth_headers)
        assert r.status_code == 200 and r.json()["status"] == "in_progress"

    def test_save_path(self, client, auth_headers):
        r = client.post("/api/users/saved-paths", params={"title": "My Path", "goal": "Learn"}, json={"path_data": {"steps": []}}, headers=auth_headers)
        assert r.status_code == 200

    def test_get_paths(self, client, auth_headers):
        client.post("/api/users/saved-paths", params={"title": "P1", "goal": "G1"}, json={"path_data": {"steps": []}}, headers=auth_headers)
        r = client.get("/api/users/saved-paths", headers=auth_headers)
        assert r.status_code == 200 and len(r.json()) >= 1

    def test_delete_path(self, client, auth_headers):
        saved = client.post("/api/users/saved-paths", params={"title": "Del", "goal": "Test"}, json={"path_data": {"steps": []}}, headers=auth_headers).json()
        r = client.delete(f"/api/users/saved-paths/{saved['id']}", headers=auth_headers)
        assert r.status_code == 200

    def test_audit_logs(self, client, auth_headers):
        r = client.get("/api/users/audit-logs", headers=auth_headers)
        assert r.status_code == 200

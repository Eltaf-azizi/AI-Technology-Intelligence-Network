class TestUsersEndpoints:
    def test_get_progress_authenticated(self, client, auth_headers):
        response = client.get("/api/users/progress", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_progress_unauthenticated(self, client):
        response = client.get("/api/users/progress")
        assert response.status_code == 401

    def test_update_progress(self, client, auth_headers):
        response = client.post("/api/users/progress", json={
            "technology_slug": "python",
            "status": "in_progress",
            "score": 50,
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["technology_slug"] == "python"
        assert data["status"] == "in_progress"
        assert data["score"] == 50

    def test_update_progress_complete(self, client, auth_headers):
        client.post("/api/users/progress", json={
            "technology_slug": "python",
            "status": "in_progress",
            "score": 50,
        }, headers=auth_headers)
        response = client.post("/api/users/progress", json={
            "technology_slug": "python",
            "status": "completed",
            "score": 100,
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["completed_at"] is not None

    def test_save_and_get_paths(self, client, auth_headers):
        save_resp = client.post("/api/users/saved-paths", params={
            "title": "My Learning Path",
            "goal": "Learn Python",
        }, json={"path_data": {"steps": ["python", "machine-learning"]}}, headers=auth_headers)
        assert save_resp.status_code == 200
        saved = save_resp.json()
        assert saved["title"] == "My Learning Path"

        get_resp = client.get("/api/users/saved-paths", headers=auth_headers)
        assert get_resp.status_code == 200
        data = get_resp.json()
        assert len(data) >= 1

    def test_delete_saved_path(self, client, auth_headers):
        save_resp = client.post("/api/users/saved-paths", params={
            "title": "To Delete",
            "goal": "Test",
        }, json={"path_data": {"steps": []}}, headers=auth_headers)
        path_id = save_resp.json()["id"]

        del_resp = client.delete(f"/api/users/saved-paths/{path_id}", headers=auth_headers)
        assert del_resp.status_code == 200

        get_resp = client.get(f"/api/users/saved-paths", headers=auth_headers)
        ids = [p["id"] for p in get_resp.json()]
        assert path_id not in ids

    def test_get_audit_logs(self, client, auth_headers):
        client.post("/api/auth/login", json={
            "username": "testuser",
            "password": "testpass123",
        })
        response = client.get("/api/users/audit-logs", headers=auth_headers)
        assert response.status_code == 200
        logs = response.json()
        assert isinstance(logs, list)

function MobilePayment({ method, amount, onSuccess, t, jazzcashNumber, easypaisaNumber, accountName }) {
  const accountNumber = method === 'jazzcash' ? jazzcashNumber : easypaisaNumber;
  const [customerMobile, setCustomerMobile] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);


  const copyNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerMobile.trim() || !transactionId.trim()) return;
    setProcessing(true);
    onSuccess(transactionId.trim(), method, customerMobile.trim());
  };


  

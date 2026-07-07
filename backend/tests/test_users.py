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


  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '16px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={18} /> {t.payment.accountName}
        </h4>
        <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{accountName}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', fontSize: '1rem', fontFamily: 'monospace' }}>
          <span style={{ fontWeight: '600' }}>{accountNumber}</span>
          <button type="button" onClick={copyNumber} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>




      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px', display: 'block' }}>{t.payment.yourMobile}</label>
        <input type="tel" required value={customerMobile} onChange={e => setCustomerMobile(e.target.value)}
          placeholder={t.payment.yourMobilePlaceholder}
          style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-card)' }} />
      </div>




      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-2)', marginBottom: '6px', display: 'block' }}>{t.payment.transactionId}</label>
        <input type="text" required value={transactionId} onChange={e => setTransactionId(e.target.value)}
          placeholder={t.payment.transactionIdPlaceholder}
          style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem', background: 'var(--bg-card)' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '4px' }}>{t.payment.sendPayment}</p>
      </div>




      <div style={{ padding: '12px', background: 'rgba(245,166,35,0.08)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-2)' }}>
        Amount to send: <strong style={{ color: 'var(--gold)', fontSize: '1rem' }}>{amount} PKR</strong>
      </div>




      <button type="submit" disabled={processing || !customerMobile.trim() || !transactionId.trim()} className="btn btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
        {processing ? 'Processing...' : `${t.payment.confirmMobilePayment} — ${amount} PKR`}
      </button>
    </form>
  );
}






function CashPayment({ amount, onSuccess, t }) {
  const [processing, setProcessing] = useState(false);
  return (
    <div>
      <div style={{ padding: '20px', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
        <Banknote size={48} style={{ color: 'var(--green)', marginBottom: '12px' }} />
        <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Pay with Cash</h4>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '4px' }}>
          Pay the worker directly in cash when the job is done.
        </p>
        <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>
          No online payment needed. Just confirm below.
        </p>
      </div>
      <div style={{ padding: '12px', background: 'rgba(245,166,35,0.08)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
        Amount to pay the worker: <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>{amount} PKR</strong>
      </div>
      <button className="btn btn-primary" onClick={() => { setProcessing(true); onSuccess('cash_' + Date.now(), 'cash'); }}
        disabled={processing}
        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
        {processing ? 'Processing...' : `Confirm Cash Payment — ${amount} PKR`}
      </button>
    </div>
  );
}




const paymentMethods = [
  { id: 'card', icon: CreditCard, labelKey: 'card' },
  { id: 'jazzcash', icon: Smartphone, labelKey: 'jazzcash' },
  { id: 'easypaisa', icon: Smartphone, labelKey: 'easypaisa' },
  { id: 'cash', icon: Banknote, labelKey: 'cash' },
];






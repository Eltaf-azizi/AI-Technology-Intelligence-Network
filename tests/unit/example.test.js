const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain a number');
  return { valid: errors.length === 0, errors };
}

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateToken(payload, secret, expiresIn = '1h') {
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

function calculateSentimentScore(scores) {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

const JWT_SECRET = 'test-secret-key';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('admin@atin.dev')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = validatePassword('StrongP4ss');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short passwords', () => {
      const result = validatePassword('Ab1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must be at least 8 characters');
    });

    it('should reject passwords without uppercase', () => {
      const result = validatePassword('lowercase1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must contain an uppercase letter');
    });

    it('should reject passwords without lowercase', () => {
      const result = validatePassword('UPPERCASE1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must contain a lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('NoNumbers!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must contain a number');
    });

    it('should report multiple errors at once', () => {
      const result = validatePassword('short');
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('Authentication Service', () => {
  it('should hash and verify passwords', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('should generate and verify JWT tokens', () => {
    const payload = { userId: '123', role: 'user' };
    const token = generateToken(payload, JWT_SECRET, '1h');
    expect(typeof token).toBe('string');
    const decoded = verifyToken(token, JWT_SECRET);
    expect(decoded.userId).toBe('123');
    expect(decoded.role).toBe('user');
  });

  it('should reject expired tokens', () => {
    const payload = { userId: '123' };
    const token = generateToken(payload, JWT_SECRET, '-1s');
    expect(() => verifyToken(token, JWT_SECRET)).toThrow('jwt expired');
  });

  it('should reject tokens with wrong secret', () => {
    const token = generateToken({ userId: '123' }, JWT_SECRET);
    expect(() => verifyToken(token, 'wrong-secret')).toThrow();
  });
});

describe('Date Formatters', () => {
  it('should format dates in YYYY-MM-DD', () => {
    const result = formatDate(new Date(2024, 0, 5));
    expect(result).toBe('2024-01-05');
  });

  it('should pad single digits', () => {
    const result = formatDate(new Date(2024, 2, 9));
    expect(result).toBe('2024-03-09');
  });

  it('should handle year-end dates', () => {
    const result = formatDate(new Date(2024, 11, 31));
    expect(result).toBe('2024-12-31');
  });
});

describe('Sentiment Calculator', () => {
  it('should calculate average sentiment', () => {
    expect(calculateSentimentScore([0.8, 0.6, 1.0])).toBeCloseTo(0.8, 2);
  });

  it('should return 0 for empty array', () => {
    expect(calculateSentimentScore([])).toBe(0);
  });

  it('should return 0 for non-array input', () => {
    expect(calculateSentimentScore(null)).toBe(0);
    expect(calculateSentimentScore(undefined)).toBe(0);
  });

  it('should handle negative scores', () => {
    expect(calculateSentimentScore([-0.5, 0.5])).toBeCloseTo(0, 5);
  });
});

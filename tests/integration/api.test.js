const request = require('supertest');
const { MongoClient } = ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');

let app;
let client;
let db;

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/atin_test';

beforeAll(async () => {
  process.env.MONGODB_URI = TEST_MONGODB_URI;
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
  process.env.NODE_ENV = 'test';

  try {
    client = new MongoClient(TEST_MONGODB_URI);
    await client.connect();
    db = client.db();
  } catch (err) {
    console.warn('MongoDB not available, tests may fail:', err.message);
  }

  try {
    app = require('../../backend/src/server').app || require('../../backend/src/app');
  } catch (err) {
    console.warn('Could not load app:', err.message);
  }
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
});

beforeEach(async () => {
  if (!db) return;
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    await db.dropCollection(col.name);
  }
});

describe('Authentication Endpoints', () => {
  const testUser = {
    email: 'test@atin.dev',
    password: 'TestPass123!',
    name: 'Test User',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not register with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'invalid' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, password: '123' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  
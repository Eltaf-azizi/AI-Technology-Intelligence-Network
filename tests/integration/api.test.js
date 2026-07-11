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

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 12);
      if (db) {
        await db.collection('users').insertOne({
          email: testUser.email,
          password: hashedPassword,
          name: testUser.name,
          role: 'user',
          isActive: true,
          preferences: { theme: 'dark' },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@atin.dev', password: 'password' })
        .expect(401);
    });
  });
});

describe('News Endpoints', () => {
  let authToken;

  beforeEach(async () => {
    if (!db) return;
    const hashedPassword = await bcrypt.hash('TestPass123!', 12);
    const result = await db.collection('users').insertOne({
      email: 'newsuser@atin.dev',
      password: hashedPassword,
      name: 'News User',
      role: 'user',
      isActive: true,
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const jwt = require('jsonwebtoken');
    authToken = jwt.sign(
      { userId: result.insertedId.toString(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    await db.collection('news').insertMany([
      {
        title: 'Test Article 1',
        source: 'TestSource',
        sentiment: 'positive',
        sentimentScore: 0.8,
        url: 'https://example.com/1',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Test Article 2',
        source: 'TestSource',
        sentiment: 'negative',
        sentimentScore: -0.6,
        url: 'https://example.com/2',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  it('should list news articles', async () => {
    const res = await request(app)
      .get('/api/news')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(res.body.news || res.body.articles || res.body)).toBe(true);
  });

  it('should require authentication', async () => {
    await request(app).get('/api/news').expect(401);
  });
});

describe('Trends Endpoints', () => {
  let authToken;

  beforeEach(async () => {
    if (!db) return;
    const hashedPassword = await bcrypt.hash('TestPass123!', 12);
    const result = await db.collection('users').insertOne({
      email: 'trenduser@atin.dev',
      password: hashedPassword,
      name: 'Trend User',
      role: 'user',
      isActive: true,
      preferences: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const jwt = require('jsonwebtoken');
    authToken = jwt.sign(
      { userId: result.insertedId.toString(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    await db.collection('technologies').insertMany([
      {
        name: 'GPT-5',
        category: 'LLM',
        description: 'Next-gen model',
        maturity: 'emerging',
        score: 95,
        trending: true,
        history: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Edge AI',
        category: 'Hardware',
        description: 'On-device AI',
        maturity: 'growth',
        score: 82,
        trending: true,
        history: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  it('should list trends', async () => {
    const res = await request(app)
      .get('/api/trends')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(res.body.trends || res.body.technologies || res.body)).toBe(true);
  });
});

describe('Admin-Only Routes', () => {
  let adminToken;
  let userToken;

  

  it('should deny regular user access to admin routes', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    expect(res.body).toHaveProperty('error');
  });
});

const express = require('express');
const { ObjectId } = require('mongodb');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } },
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { name, email } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
        return res.status(400).json({ error: 'Name must be between 1 and 100 characters' });
      }
      updates.name = name.trim();
    }

    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const existing = await db.collection('users').findOne({
        email,
        _id: { $ne: new ObjectId(req.user.userId) },
      });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updatedAt = new Date();

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.user.userId) },
      { $set: updates },
      { returnDocument: 'after', projection: { password: 0 } },
    );

    res.json({ user: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/preferences', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { preferences: 1, _id: 0 } },
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ preferences: user.preferences || {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.patch('/preferences', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const allowed = ['theme', 'emailNotifications', 'pushNotifications', 'digestFrequency'];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[`preferences.${key}`] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid preference fields to update' });
    }

    if (updates['preferences.theme'] && !['light', 'dark', 'auto'].includes(updates['preferences.theme'])) {
      return res.status(400).json({ error: 'Theme must be light, dark, or auto' });
    }

    if (
      updates['preferences.digestFrequency'] &&
      !['realtime', 'daily', 'weekly'].includes(updates['preferences.digestFrequency'])
    ) {
      return res.status(400).json({ error: 'Digest frequency must be realtime, daily, or weekly' });
    }

    updates.updatedAt = new Date();

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.user.userId) },
      { $set: updates },
      { returnDocument: 'after', projection: { password: 0 } },
    );

    res.json({ preferences: result.preferences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

router.delete('/account', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.user.userId) },
      {
        $set: {
          isActive: false,
          deactivatedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Account deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
});

router.get('/activity', authenticate, async (req, res) => {
  try {
    const { db } = req.app.locals;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const activities = await db
      .collection('activitylogs')
      .find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router;

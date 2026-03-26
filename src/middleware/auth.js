import admin from 'firebase-admin';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

// Initialize Firebase Admin (uses project ID only — no service account needed for token verification)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: env.firebaseProjectId,
  });
}

export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }

  try {
    const idToken = header.split(' ')[1];
    
    // Verify the Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    // Find or auto-create the user in MongoDB
    let user = await User.findOne({ firebaseUid: decoded.uid });
    
    if (!user) {
      // Auto-create user on first API call after Firebase login
      user = await User.create({
        firebaseUid: decoded.uid,
        username: decoded.name || decoded.email?.split('@')[0] || 'user',
        email: decoded.email || `${decoded.uid}@devposting.app`,
        avatar: decoded.picture || '',
        authProvider: decoded.firebase?.sign_in_provider === 'github.com' 
          ? 'github' 
          : decoded.firebase?.sign_in_provider === 'google.com'
            ? 'google'
            : 'email',
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
}

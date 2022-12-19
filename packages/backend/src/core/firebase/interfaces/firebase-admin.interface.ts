import * as firebaseAdmin from 'firebase-admin';

export interface FirebaseAdmin {
  auth: firebaseAdmin.auth.Auth;
  messaging: firebaseAdmin.messaging.Messaging;
  db: firebaseAdmin.firestore.Firestore;
  storage: firebaseAdmin.storage.Storage;
}

import * as admin from 'firebase-admin';
import { FirebaseAdmin } from 'src/core/firebase/interfaces/firebase-admin.interface';
import { FirebaseModuleOptions } from 'src/core/firebase/interfaces/firebase-module-options.interface';

const createInstances = (app: admin.app.App): FirebaseAdmin => ({
  auth: app.auth(),
  messaging: app.messaging(),
  db: app.firestore(),
  storage: app.storage(),
});

export const getFirebaseInstance = (
  options?: FirebaseModuleOptions,
): FirebaseAdmin => {
  if (!options || Object.values(options).filter((v) => !!v).length === 0) {
    return createInstances(
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      }),
    );
  }
  const { googleApplicationCredential: serviceAccountPath, ...appOptions } =
    options;
  return createInstances(
    admin.initializeApp({
      credential: serviceAccountPath
        ? admin.credential.cert(serviceAccountPath)
        : undefined,
      ...appOptions,
    }),
  );
};

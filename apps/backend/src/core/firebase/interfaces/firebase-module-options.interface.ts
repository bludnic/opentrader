import * as firebaseAdmin from 'firebase-admin';
import { AppOptions } from 'firebase-admin';

export type FirebaseModuleOptions = {
  googleApplicationCredential?: string | firebaseAdmin.ServiceAccount;
} & AppOptions;

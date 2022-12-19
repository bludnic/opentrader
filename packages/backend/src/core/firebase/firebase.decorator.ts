import { Inject } from '@nestjs/common';
import { FirebaseConstants } from './constants';

export function InjectFirebaseAdmin() {
  return Inject(FirebaseConstants.FIREBASE_TOKEN);
}

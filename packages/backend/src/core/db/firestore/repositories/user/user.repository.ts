import { Injectable } from '@nestjs/common';
import { mapUserClaims } from 'src/core/db/firestore/utils/user/mapUserClaims';
import { UserEntity } from 'src/core/db/types/entities/users/user/user.entity';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

@Injectable()
export class UserRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOneByIdToken(idToken: string): Promise<UserEntity> {
    const { uid } = await this.firebase.auth.verifyIdToken(idToken, true);
    const userRecord = await this.firebase.auth.getUser(uid);

    const user = new UserEntity({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      customClaims: mapUserClaims(userRecord.customClaims),
    });

    return user;
  }
}

import { IUserClaims } from 'src/core/db/types/entities/users/user-claims/user-claims.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';

export class UserEntity implements IUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  phoneNumber?: string;
  customClaims: IUserClaims;

  constructor(user: IUser) {
    Object.assign(this, user);
  }
}

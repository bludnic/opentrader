import { IUserClaims } from './user-claims.interface';

export class UserClaimsEntity implements IUserClaims {
  admin: boolean;

  constructor(userClaims: IUserClaims) {
    Object.assign(this, userClaims);
  }
}

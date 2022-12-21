import { IUserClaims } from 'src/core/db/firestore/types/users/user/user-claims.interface';

export interface IUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  phoneNumber?: string;
  customClaims: IUserClaims;
}

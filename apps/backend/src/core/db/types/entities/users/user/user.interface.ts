import { IUserClaims } from 'src/core/db/types/entities/users/user-claims/user-claims.interface';

export interface IUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  phoneNumber?: string;
  customClaims: IUserClaims;
}

import { IUserClaims } from 'src/core/db/firestore/types/users/user/user-claims.interface';

export function mapUserClaims(
  customClaims: {
    [key: string]: any;
  } = {},
): IUserClaims {
  const { admin = false } = customClaims;

  return {
    admin,
  };
}

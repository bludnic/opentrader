import { IUserClaims } from 'src/core/db/types/entities/users/user-claims/user-claims.interface';

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

import { signature } from './signature';
import { AuthSecurityType } from './types/auth-security-type.enum';

type AuthHeadersSecurityNone = null;

type AuthHeadersSecurityApiKeyOnly = {
  APIKEY: string;
};

type AuthHeadersSecuritySigned = {
  APIKEY: string;
  Signature: string;
};

type AuthHeaders =
  | AuthHeadersSecurityNone
  | AuthHeadersSecurityApiKeyOnly
  | AuthHeadersSecuritySigned;

export function authHeaders(
  securityType: AuthSecurityType,
  requestPath: string,
  apiKey: string,
  secretKey: string,
): AuthHeaders {
  if (securityType === AuthSecurityType.None) {
    return null;
  }

  if (securityType === AuthSecurityType.ApiKeyOnly) {
    return {
      APIKEY: apiKey,
    };
  }

  // securityType === AuthSecurityType.Signed
  return {
    APIKEY: apiKey,
    Signature: signature(requestPath, secretKey),
  };
}

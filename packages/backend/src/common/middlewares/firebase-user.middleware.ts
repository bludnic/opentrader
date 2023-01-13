import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

export const REQ_USER_ACCOUNT_KEY = 'user';

const masterKey = 'master_trader_RyyznhU25bWSRYw3';
const masterUserId = 'd3RcKHXukfOYq3Z27MNj2ZnbLQd2';

export function extractBearerToken(
  headers: IncomingHttpHeaders,
): string | null {
  if (typeof headers.authorization !== 'string') {
    return null;
  }

  const idToken = headers.authorization.split('Bearer ')[1];

  return idToken || null;
}

@Injectable()
export class FirebaseUserMiddleware implements NestMiddleware {
  constructor(
    private readonly firestore: FirestoreService,
    private readonly logger: Logger,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const idToken = extractBearerToken(req.headers);

    if (!idToken) {
      throw new UnauthorizedException(
        `Missing or invalid "Authorization: Bearer idToken"`,
      );
    }

    // Удалить когда-то
    if (idToken === masterKey) {
      try {
        const user = await this.firestore.user.findByUid(masterUserId);

        (req as any)[REQ_USER_ACCOUNT_KEY] = user;
      } catch (err) {
        this.logger.error('FirebaseUserMiddleware.use', err);
        throw new NotFoundException(err.message);
      }

      next();
      return;
    }

    try {
      const user = await this.firestore.user.findOneByIdToken(idToken);

      (req as any)[REQ_USER_ACCOUNT_KEY] = user;
    } catch (err) {
      this.logger.error('FirebaseUserMiddleware.use', err);
      throw new NotFoundException(err.message);
    }

    next();
  }
}

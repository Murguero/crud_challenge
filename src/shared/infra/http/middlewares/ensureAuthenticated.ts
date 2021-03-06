import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import CustomError from '@shared/errors/CustomError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new CustomError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decode = verify(token, authConfig.jwt.secret);

    const { sub } = decode as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new CustomError('Invalid JWT token', 401);
  }
}

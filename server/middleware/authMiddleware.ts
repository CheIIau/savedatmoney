import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
// import { nextTick } from 'process';
import { jwtAccessSecretKey } from '../constants';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS' || !req.headers.authorization) {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Ошибка авторизации' });
    }
    const decodedJwt = verify(token, jwtAccessSecretKey);
    req.user = decodedJwt as DecodedJwt;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ошибка авторизации' });
  }
}

interface DecodedJwt {
  userId: string;
}

// export type RequestWithUser = Request & {
//   user: {
//     userId: string;
//   };
// };

// type AuthorizedRequest = Request & {
//   headers: {
//     authorization: string;
//   };
// };

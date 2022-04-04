"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
// import { nextTick } from 'process';
const constants_1 = require("../constants");
function verifyToken(req, res, next) {
    if (req.method === 'OPTIONS' || !req.headers.authorization) {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Ошибка авторизации' });
        }
        const decodedJwt = (0, jsonwebtoken_1.verify)(token, constants_1.jwtAccessSecretKey);
        req.user = decodedJwt;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Ошибка авторизации' });
    }
}
exports.verifyToken = verifyToken;
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
//# sourceMappingURL=authMiddleware.js.map
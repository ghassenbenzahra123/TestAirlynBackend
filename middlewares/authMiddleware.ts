import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface DecodedToken {
  userId: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token: string = authorizationHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY as Secret) as DecodedToken | undefined;
      if (decoded && decoded.userId) {
        req.body.userId = decoded.userId;
      }
    }
    next();
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ message: err.message, success: false });
  }
};

export default authMiddleware;

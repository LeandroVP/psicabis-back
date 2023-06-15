import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class ValidateTokenHandler {

  public async validate(req: Request, res: Response, next: () => void) {

    let token;
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      verify(token, process.env.JWT_SECRET, (err, dec) => {
        if (err) {
          res.status(401).json('unauthorized');
        }
        else {
          req.params = { ...req.params, USER_DECODED_ID: dec.id }
          next();
        }
      })
    }
  }
}

export const validateTokenHandler = new ValidateTokenHandler();

import { Request, Response } from 'express';
import { pbkdf2Sync, randomBytes, randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';

import { body, check, validationResult } from 'express-validator';

import pool from '../database'

class AuthController {

  static salt() {
    return randomBytes(20).toString('hex');
  }

  static hash(password, salt) {
    return pbkdf2Sync(password, salt,
      1000, 64, `sha512`).toString(`hex`);
  }

  static valid(password, salt, hash) {
    return AuthController.hash(password, salt) === hash
  }


  // public async register(req: Request, res: Response) {
  //   let salt = AuthController.salt()
  //   let hash = AuthController.hash(req.body.password, salt)
  //   console.log(salt)
  //   console.log(AuthController.valid(req.body.password + 'a', salt, hash))
  //   // console.log(req)

  //   await pool.query('SELECT * FROM categories', (err, result) => {
  //     if (err) throw (err)
  //     if (result.length > 0) {
  //       res.json(result[0])
  //     }
  //     else res.status(404).json({ text: 'Image not found' })
  //   });
  //   // })
  // }

  public async login(req: Request<{}, {}, { email: string, password: string }>, res: Response) {




    await pool.query('SELECT hash, salt, id, email FROM users WHERE email = ?', req.body.email, (err, result) => {
      let currentDate = new Date();
      if (err) console.log(err)
      if (result[0] && AuthController.valid(req.body.password, result[0].salt, result[0].hash)) {
        const access_token = sign({
          id: result[0].id,
          email: result[0].email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
        // process.env.JWT_EXPIRES_IN is expressed in miliseconds as an int.
        res.json({ access_token, token_type: 'bearer', expires_in: new Date(currentDate.getTime() + +process.env.JWT_EXPIRES_IN) });
      } else {

        res.json({ status: ':(' });
      }
    });
  }

  public async register(req: Request<{}, {}, { email: string, password: string }>, res: Response) {
    const id = randomUUID();
    let salt = AuthController.salt()
    let hash = AuthController.hash(req.body.password, salt)
    await pool.query('INSERT INTO users set ?', { email: req.body.email, salt, hash, id }, (err, result) => {
      if (err) console.log(err)
      res.json({ id });
    });
  }

  public async userInfo(req: Request, res: Response) {
    console.log(req.body.USER_DECODED_ID)
    await pool.query('SELECT id, name, familyName, email FROM  users WHERE id = ?', req.body.USER_DECODED_ID, (err, result) => {
      if (err) console.log(err)
      res.json(result[0]);
    });
  }


};

export const authController = new AuthController();
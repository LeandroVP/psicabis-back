import { PasswordHelper } from './../helpers/password.helper';
import { Request, Response } from 'express';
import { pbkdf2Sync, randomBytes, randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';

import { body, check, validationResult } from 'express-validator';

import pool from '../database'

class AuthController {


  public async login(req: Request<{}, {}, { email: string, password: string }>, res: Response) {

    await pool.query('SELECT hash, salt, id, email FROM users WHERE email = ?', req.body.email, (err, result) => {
      let currentDate = new Date();
      if (err) console.log(err)
      if (result[0] && PasswordHelper.valid(req.body.password, result[0].salt, result[0].hash)) {
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

  public async register(req: Request, res: Response) {
    const id = randomUUID();
    const { email, name, familyName } = req.body;
    const { salt, hash } = PasswordHelper.getPasswordData(req.body.password)
    await pool.query('INSERT INTO users set ?', { email, name, familyName, salt, hash, id }, (err, result) => {
      if (err) console.log(err)
      res.json({ id });
    });
  }

  public async changePassword(req: Request, res: Response) {
    const { salt, hash } = PasswordHelper.getPasswordData(req.body.password)
    await pool.query('UPDATE users set ? WHERE id = ?', [{ salt, hash }, req.params.USER_DECODED_ID], (err, result) => {
      if (err) console.log(err)
      res.json(result[0]);
    });
  }

  public async userInfo(req: Request, res: Response) {
    await pool.query('SELECT id, name, familyName, email FROM  users WHERE id = ?', req.params.USER_DECODED_ID, (err, result) => {
      if (err) console.log(err)
      res.json(result[0]);
    });
  }

  public async updateUserInfo(req: Request, res: Response) {

    await pool.query('UPDATE users set ? WHERE id = ?', [req.body, req.params.USER_DECODED_ID], (err, result) => {
      if (err) console.log(err)
      res.json(result[0]);
    });
  }

};

export const authController = new AuthController();
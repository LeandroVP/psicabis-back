import { PasswordHelper } from './../helpers/password.helper';
import { Request, Response } from 'express';
import pool from '../database';


class UsersController {

  public async list(req: Request, res: Response) {
    await pool.query('SELECT * FROM users', (err, result) => {
      if (err) throw (err)
      res.json(result);
    })
  }

  public async element(req: Request, res: Response) {
    await pool.query('SELECT * FROM users WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      if (result.length > 0) res.json(result[0]);
      else res.status(404).json({ text: 'User not found' })
    });
  }

  public async delete(req: Request, res: Response) {
    await pool.query('DELETE FROM users WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      res.json({ message: 'DELETED' })
    })
  }

  public async update(req: Request, res: Response) {
    let user = undefined;
    const { id, password, email, name, familyName } = req.body;
    if (password) {
      const { salt, hash } = PasswordHelper.getPasswordData(password);
      user = { id, email, name, familyName, salt, hash };
    } else {
      user = { id, email, name, familyName };
    }
    await pool.query('UPDATE users set ? WHERE id = ?', [user, req.body.id], (err, result) => {
      if (err) throw (err)
      res.json({ message: 'UPDATED' })
    })
  }
};

export const usersController = new UsersController();


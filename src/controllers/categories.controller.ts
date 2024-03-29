import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { body, check, validationResult } from 'express-validator';
import { idMatches } from '../validators/id-matches.validator';
import pool from '../database';


class CategoriesController {

  // public newDonationValidator = [
  //   check('lastName').isLength({ min: 3 }).trim().escape(),
  //   check('firstName').isLength({ min: 3 }).trim().escape(),
  //   check('email').isEmail().normalizeEmail(),
  //   check('amount').isNumeric().trim().escape(),
  //   check('documentNumber').isLength({ min: 9, max: 9 }).trim().escape(),
  //   check('amount').isNumeric().isLength({ max: 7 }).trim().escape(),
  // ]

  // public updateDonationValidator = [
  //   ...this.newDonationValidator,
  //   check('date').isISO8601(),
  //   body('id').custom(idMatches)
  // ]

  public async list(req: Request, res: Response) {
    await pool.query('SELECT * FROM categories ORDER BY updated DESC', (err, result) => {
      if (err) throw (err)
      res.json(result);
    })
  }

  public async element(req: Request, res: Response) {
    await pool.query('SELECT * FROM categories WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      if (result.length > 0) res.json(result[0]);
      else res.status(404).json({ text: 'Category not found' })
    });
  }

  public async create(req: Request, res: Response) {
    const id = randomUUID();
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    await pool.query('INSERT INTO categories set ?', { ...req.body, id }, (err, result) => {
      if (err) throw (err)
      res.json({ id });
    });
  }

  public async delete(req: Request, res: Response) {
    await pool.query('DELETE FROM categories WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      res.json({ message: 'DELETED' })
    })
  }

  public async update(req: Request, res: Response) {
    // const errors = validationResult(req);

    // if (!errors.isEmpty() || req.body.id !== req.params.id) {
    //   return res.status(400).json({ errors: errors.array() });
    // }


    await pool.query('UPDATE categories set ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
      if (err) throw (err)
      res.json({ message: 'UPDATED' })
    })
  }
};

export const categoriesController = new CategoriesController();
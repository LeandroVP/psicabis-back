import { Category } from './../models/category.model';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { body, check, validationResult } from 'express-validator';
import { idMatches } from '../validators/id-matches.validator';
import pool from '../database';


class DashboardController {

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
    await pool.query(
      'SELECT p.*, usr.name AS lastEditorName, usr.familyName AS lastEditorFamilyName, u.name AS authorName, u.familyName AS authorFamilyName  ' +
      'FROM publications p LEFT JOIN users AS u ON p.authorId = u.id  LEFT JOIN users AS usr ON p.lastEditorId = usr.id ' +
      'ORDER BY p.updated DESC LIMIT 10'
      , (err, result) => {
        if (err) throw (err)
        res.json(result);
      })
  }

  public async updateSelectedData(req: Request, res: Response) {
    await pool.query('DELETE FROM config; INSERT INTO config set ?', { ...req.body }, (err, result) => {
      if (err) throw (err)
      res.json(result);
    })
  }

  public async selectedData(req: Request, res: Response) {

    const ids = await new Promise((resolve) => {
      pool.query('SELECT * FROM config ', (err, result) => {
        resolve(result)
      })
    })

    const publicationsIds: string[] = ids[0].publications.split(", ");
    const categoriesIds: string[] = ids[0].categories.split(", ");

    const publications = await new Promise((resolve) => {
      pool.query(`SELECT * FROM publications WHERE id IN( ? ) ORDER BY FIELD(id, ?);`, [publicationsIds, publicationsIds], (err, result) => {
        resolve(result)
      })
    })

    const categories = await new Promise((resolve) => {
      pool.query(`SELECT * FROM categories WHERE id IN( ? ) ORDER BY FIELD(id, ?);`, [categoriesIds, categoriesIds], (err, result) => {
        resolve(result)
      })
    })

    res.json({ publications, categories })
  }


};

export const dashboardController = new DashboardController();
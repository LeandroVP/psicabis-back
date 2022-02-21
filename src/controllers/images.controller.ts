import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { body, check, validationResult } from 'express-validator';

import pool from '../database'
import { idMatches } from './validators/id-matches.validator';



// const upload = Multer({
//   dest: "public/images"
//   // you might also want to set some limits: https://github.com/expressjs/multer#limits
// });

class ImagesController {

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
    await pool.query('SELECT id FROM images', (err, result) => {
      if (err) throw (err)
      res.json(result);
    })
  }

  public async element(req: Request, res: Response) {
    await pool.query('SELECT * FROM images WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      if (result.length > 0) {
        res.sendFile(result[0].path, { root: '.' })
      }
      else res.status(404).json({ text: 'Image not found' })
    });
  }

  public async create(req: Request, res: Response) {
    const id = randomUUID();
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    console.log(req.file)
    // res.json({ message: 'OK' })

    await pool.query('INSERT INTO images set ?', { path: req.file.path, id, originalname: req.file.originalname }, (err, result) => {
      if (err) throw (err)
      res.json({ id });
    });
  }

  public async delete(req: Request, res: Response) {
    await pool.query('DELETE FROM images WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      res.json({ message: 'DELETED' })
    })
  }

  public async update(req: Request, res: Response) { //Should not exist. Use as example.
    const errors = validationResult(req);

    if (!errors.isEmpty() || req.body.id !== req.params.id) {
      return res.status(400).json({ errors: errors.array() });
    }


    await pool.query('UPDATE images set ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
      if (err) throw (err)
      console.log(result)
      res.json({ message: 'UPDATED' })
    })
  }
};

export const imagesController = new ImagesController();
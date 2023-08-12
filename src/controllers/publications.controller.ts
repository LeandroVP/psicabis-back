import { PublicationCore } from './../models/publication.model';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { body, check, validationResult } from 'express-validator';

import pool from '../database'

class PublicationsController {

  public async list(req: Request, res: Response) {
    // await pool.query('SELECT * FROM donations', (err, result) => {
    //   if (err) throw (err)
    //   res.json(result);
    // })
  }

  public async element(req: Request, res: Response) {
    // await pool.query('SELECT * FROM publications WHERE id = ? ; ', req.params.id, (err, result) => {
    //   if (err) throw (err)
    //   if (result.length > 0) res.json(result[0]);
    //   else res.status(404).json({ text: 'Donation not found' })
    // });
    let firstQuery = new Promise((resolve, reject) => {
      pool.query('SELECT * FROM publications WHERE id = ? ; ', req.params.id, (err, result) => {
        if (err) reject(err)
        if (result.length > 0)
          resolve(result)
      });
    })
    let secondQuery = new Promise((resolve, reject) => {
      pool.query('SELECT * FROM components WHERE id = ? ; ', req.params.id, (err, result) => {
        if (err) reject(err)
        if (result.length > 0)
          resolve(result)
      });
    })
  }

  public async create(req: Request<any, any, PublicationCore>, res: Response) {
    const authorId = req.params.USER_DECODED_ID;
    const publicationId = randomUUID();
    const newPublication = req.body;
    let modulesQuery = '';
    let contentsQuery = '';
    let contents = [];
    let modules = [];
    newPublication.id = publicationId;
    newPublication.modules.forEach(mod => {
      const moduleId = randomUUID();
      mod.id = moduleId;
      mod.publicationId = publicationId;
      modulesQuery = modulesQuery + 'INSERT INTO modules set ?;'
      contents.push(...mod.content)
      mod.content.forEach(cont => {
        cont.moduleId = moduleId;
        cont.id = randomUUID();
        contentsQuery = contentsQuery + 'INSERT INTO contents set ?;'
      })
      delete mod.content;
    })
    modules = [...newPublication.modules];
    delete newPublication.modules;
    await pool.query('INSERT INTO publications set ?;' + modulesQuery + contentsQuery, [{ ...newPublication, authorId, lastEditorId: authorId }, ...modules, ...contents], (err, result) => {
      if (err) throw (err)
      res.json({ message: 'INSERTED' })
    });
    console.log(req.body)
    // let childrenQuery = '';
    // let components = [];

    // // console.log(req.body)
    // req.body.children.forEach(component => {
    //   components.push({ ...component, parent_id: parent_id, id: randomUUID() });
    //   childrenQuery += ' INSERT INTO components set ? ;'
    // });

    // req.body.publication.image_path = 'public\\images\\1645377044866-990130051.jpeg'; // TODO

    // await pool.query('INSERT INTO publications set ? ;' + childrenQuery, [{ ...req.body.publication, id: parent_id }, ...components], (err, result) => {
    //   if (err) throw (err)
    // });

  }

  public async delete(req: Request, res: Response) {
    // await pool.query('DELETE FROM donations WHERE id = ?', req.params.id, (err, result) => {
    //   if (err) throw (err)
    //   res.json({ message: 'DELETED' })
    // })
  }

  public async update(req: Request, res: Response) { //Should not exist. Use as example.
    //   const errors = validationResult(req);

    //   if (!errors.isEmpty() || req.body.id !== req.params.id) {
    //     return res.status(400).json({ errors: errors.array() });
    //   }


    //   await pool.query('UPDATE donations set ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
    //     if (err) throw (err)
    //     console.log(result)
    //     res.json({ message: 'UPDATED' })
    //   })
  }
};

export const publicationsController = new PublicationsController();
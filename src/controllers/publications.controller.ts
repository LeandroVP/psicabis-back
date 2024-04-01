import { PublicationCore, Module, Publication, ModuleContent } from './../models/publication.model';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import { body, check, validationResult } from 'express-validator';

import pool from '../database'
import { PublicationsHelper } from '../helpers/publications.helper';

class PublicationsController {

  public async list(req: Request, res: Response) {
    await pool.query('SELECT p.*, u.name, u.familyName, u.name AS authorName, u.familyName AS authorFamilyName FROM publications p LEFT JOIN users u ON p.authorId = u.id ', (err, result) => {
      if (err) throw (err)
      res.json(result);
    })

  }

  public async listByCategory(req: Request, res: Response) {
    const id = req.params.id || '*'
    await pool.query('SELECT p.*, u.name, u.familyName, u.name AS authorName, u.familyName AS authorFamilyName FROM publications p LEFT JOIN users u ON p.authorId = u.id WHERE p.categoryId = ? ORDER BY created', id, (err, result) => {
      if (err) throw (err)
      res.json(result);
    })

  }

  public async element(req: Request, res: Response) {

    const contents = await new Promise<ModuleContent[]>((resolve) => {
      pool.query('SELECT c.* FROM publications p LEFT JOIN modules m ON p.id = m.publicationId LEFT JOIN contents c ON m.id = c.moduleId WHERE p.id = ? ORDER BY position', req.params.id, (err, result) => {
        resolve(PublicationsHelper.queryResponseArrayFormatter(result))
      })
    })

    const modules = await new Promise<Omit<Module, 'contents'>[]>((resolve) => {
      pool.query('SELECT m.* FROM publications p LEFT JOIN modules m ON p.id = m.publicationId WHERE p.id = ?  ORDER BY position', req.params.id, (err, result) => {
        resolve(PublicationsHelper.queryResponseArrayFormatter(result))
      })
    })

    const publication = await new Promise<Omit<Publication, 'modules'>[]>((resolve) => {
      pool.query('SELECT * FROM publications p WHERE p.id = ?', req.params.id, (err, result) => {
        resolve(result[0])
      })
    })

    res.json({ ...publication, modules: PublicationsHelper.moduleArrayBuilder(modules, contents) })
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
      res.json({ message: 'CREATED' })
    });
  }

  public async delete(req: Request, res: Response) {
    await pool.query('DELETE FROM publications WHERE id = ?', req.params.id, (err, result) => {
      if (err) throw (err)
      res.json({ message: 'DELETED' })
    })
  }

  public async update(req: Request, res: Response) {
    const lastEditorId = req.params.USER_DECODED_ID;
    const editedPublication: Publication = req.body.publication;
    const deletedModulesId: string[] = req.body.deletedModulesId;
    const deletedContentsId: string[] = req.body.deletedContentsId;
    let modulesQuery = '';
    let contentsQuery = '';
    let deletedModulesQuery = '';
    let deletedContentsQuery = '';
    let contents = [];
    let modules = [];
    if (deletedModulesId.length > 0) {
      deletedModulesId.forEach(id => {
        deletedModulesQuery += 'DELETE FROM modules WHERE id = ?;'

      });
    }
    if (deletedContentsId.length > 0) {
      deletedContentsId.forEach(id => {
        deletedContentsQuery += 'DELETE FROM contents WHERE id = ?;'

      });
    }
    editedPublication.modules.forEach(mod => {
      if (!mod.id) {
        const moduleId = randomUUID();
        mod.id = moduleId;
        mod.publicationId = editedPublication.id;
        modulesQuery = modulesQuery + 'INSERT INTO modules set ?;'
      }
      else {
        modulesQuery = modulesQuery + `UPDATE modules set ? WHERE id = '${mod.id}';`
      }
      contents.push(...mod.content)
      mod.content.forEach(cont => {
        if (!cont.id) {
          cont.moduleId = mod.id;
          cont.id = randomUUID();
          contentsQuery = contentsQuery + 'INSERT INTO contents set ?;'
        }
        else {
          contentsQuery = contentsQuery + `UPDATE contents set ? WHERE id = '${cont.id}';`
        }
      })
      delete mod.content;
    })
    modules = [...editedPublication.modules];
    delete editedPublication.modules;
    await pool.query(`UPDATE publications set ? WHERE id = '${editedPublication.id}';` + modulesQuery + contentsQuery + deletedModulesQuery + deletedContentsQuery, [{ ...editedPublication, lastEditorId }, ...modules, ...contents, ...deletedModulesId, ...deletedContentsId], (err, result) => {
      if (err) throw (err)
      res.json({ message: 'EDITED' })
    });
  }
};

export const publicationsController = new PublicationsController();
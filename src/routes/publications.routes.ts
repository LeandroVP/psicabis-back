import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { publicationsController } from './../controllers/publications.controller';
import { Router } from "express";


class PublicationsRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', validateTokenHandler.validate, publicationsController.list)
    this.router.get('/:id', validateTokenHandler.validate, publicationsController.element)
    this.router.post('/', validateTokenHandler.validate, publicationsController.create)
    this.router.put('/:id', validateTokenHandler.validate, publicationsController.update)
    this.router.delete('/:id', validateTokenHandler.validate, publicationsController.delete)
  }
}

const publicationsRoutes = new PublicationsRoutes();
export default publicationsRoutes.router
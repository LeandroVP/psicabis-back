import { publicationsController } from './../controllers/publications.controller';
import { Router } from "express";


class PublicationsRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', publicationsController.list)
    this.router.get('/:id', publicationsController.element)
    this.router.post('/', publicationsController.create)
    this.router.put('/:id', publicationsController.update)
    this.router.delete('/:id', publicationsController.delete)
  }
}

const publicationsRoutes = new PublicationsRoutes();
export default publicationsRoutes.router
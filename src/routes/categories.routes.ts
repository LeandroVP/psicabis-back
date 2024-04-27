import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { Router } from "express";
import { categoriesController } from "../controllers/categories.controller";

class CategoriesRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', categoriesController.list)
    this.router.get('/:id', categoriesController.element)
    this.router.post('/', validateTokenHandler.validate, categoriesController.create)
    this.router.put('/:id', validateTokenHandler.validate, categoriesController.update)
    this.router.delete('/:id', validateTokenHandler.validate, categoriesController.delete)
  }
}

const categoriesRoutes = new CategoriesRoutes();
export default categoriesRoutes.router
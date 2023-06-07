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
    // this.router.post('/', categoriesController.newDonationValidator, categoriesController.create)
    // this.router.put('/:id', categoriesController.updateDonationValidator, categoriesController.update)
    this.router.post('/', categoriesController.create)
    this.router.put('/:id', categoriesController.update)
    this.router.delete('/:id', categoriesController.delete)
  }
}

const categoriesRoutes = new CategoriesRoutes();
export default categoriesRoutes.router
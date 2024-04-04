import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { Router } from "express";
import { usersController } from "../controllers/users.controller";

class UsersRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', validateTokenHandler.validate, usersController.list)
    this.router.get('/:id', validateTokenHandler.validate, usersController.element)
    this.router.put('/:id', validateTokenHandler.validate, usersController.update)
    this.router.delete('/:id', validateTokenHandler.validate, usersController.delete)
  }
}

const usersRoutes = new UsersRoutes();
export default usersRoutes.router
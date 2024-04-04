import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { Router } from "express";
import { authController } from "../controllers/auth.controller";

class AuthRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.post('/register', authController.register)
    this.router.post('/login', authController.login)
    this.router.get('/userInfo', validateTokenHandler.validate, authController.userInfo)
    this.router.put('/userInfo', validateTokenHandler.validate, authController.updateUserInfo)
    this.router.put('/changePassword', validateTokenHandler.validate, authController.changePassword)
  }
}

const authRoutes = new AuthRoutes();
export default authRoutes.router
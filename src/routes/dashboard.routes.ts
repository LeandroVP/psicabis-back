import { dashboardController } from './../controllers/dashboard.controller';
import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { Router } from "express";

class DashboardRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', validateTokenHandler.validate, dashboardController.list)
  }
}

const dashboardRoutes = new DashboardRoutes();
export default dashboardRoutes.router
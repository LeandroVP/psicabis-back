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
    this.router.get('/selected', validateTokenHandler.validate, dashboardController.selectedData)
    this.router.put('/selected', validateTokenHandler.validate, dashboardController.updateSelectedData)
  }
}

const dashboardRoutes = new DashboardRoutes();
export default dashboardRoutes.router
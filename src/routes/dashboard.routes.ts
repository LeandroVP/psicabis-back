import { dashboardController } from './../controllers/dashboard.controller';
import { validateTokenHandler } from './../middleware/validateTokenHandler';
import { Router } from "express";

class DashboardRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', dashboardController.list)
    this.router.get('/selected', dashboardController.selectedData)
    this.router.put('/selected', validateTokenHandler.validate, dashboardController.updateSelectedData)
  }
}

const dashboardRoutes = new DashboardRoutes();
export default dashboardRoutes.router
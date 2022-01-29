import { donationsController } from './../controllers/donations.controller';
import { Router } from "express";

class DonationsRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', donationsController.list)
    this.router.get('/:id', donationsController.element)
    this.router.post('/', donationsController.newDonationValidator, donationsController.create)
    this.router.put('/:id', donationsController.updateDonationValidator, donationsController.update)
    this.router.delete('/:id', donationsController.delete)
  }
}

const donationsRoutes = new DonationsRoutes();
export default donationsRoutes.router
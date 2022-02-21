import { Router } from "express";
import { imagesController } from "../controllers/images.controller";

const multer = require('multer')

// Para cambiar cosas del archivo:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileType = file.mimetype.split('/')[1];
    cb(null, uniqueSuffix + '.' + fileType)
  }
})
const upload = multer({
  storage
})


class ImagesRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/', imagesController.list)
    this.router.get('/:id', imagesController.element)
    this.router.post('/', upload.single('image'), imagesController.create)
    // this.router.put('/:id', imagesController.updateDonationValidator, imagesController.update)
    // this.router.delete('/:id', imagesController.delete)
  }
}

const imagesRoutes = new ImagesRoutes();
export default imagesRoutes.router
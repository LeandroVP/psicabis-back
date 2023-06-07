import express, { Application } from "express";
import morgan from 'morgan';
import cors from 'cors'
import donationsRoutes from "./routes/donations.routes"
import indexRoutes from "./routes/index.routes"
import imagesRoutes from "./routes/images.routes";
import publicationsRoutes from "./routes/publications.routes";
import categoriesRoutes from "./routes/categories.routes";
class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.set('port', process.env.PORT || 3000)
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }))
    }

    routes() {
        this.app.use(indexRoutes)
        this.app.use('/api/donations', donationsRoutes)
        this.app.use('/api/images', imagesRoutes)
        this.app.use('/api/publications', publicationsRoutes)
        this.app.use('/api/categories', categoriesRoutes)
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor escuchando en el puerto ' + this.app.get('port'))
        })
    }
}

const server = new Server();
server.start();
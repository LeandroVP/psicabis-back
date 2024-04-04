import express, { Application } from "express";
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors'
import donationsRoutes from "./routes/donations.routes"
import indexRoutes from "./routes/index.routes"
import imagesRoutes from "./routes/images.routes";
import publicationsRoutes from "./routes/publications.routes";
import categoriesRoutes from "./routes/categories.routes";
import authRoutes from "./routes/auth.routes";
import 'dotenv/config'
import dashboardRoutes from "./routes/dashboard.routes";
import usersRoutes from "./routes/users.routes";
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
        this.app.use(bodyParser.json({ limit: '100mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));
    }

    routes() {
        this.app.use(indexRoutes)
        this.app.use('/api/donations', donationsRoutes)
        this.app.use('/api/images', imagesRoutes)
        this.app.use('/api/publications', publicationsRoutes)
        this.app.use('/api/categories', categoriesRoutes)
        this.app.use('/api/auth', authRoutes)
        this.app.use('/api/dashboard', dashboardRoutes)
        this.app.use('/api/users', usersRoutes)
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor escuchando en el puerto ' + this.app.get('port'))
        })
    }
}

const server = new Server();
server.start();
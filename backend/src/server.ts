import 'dotenv/config';
import express, { Application } from 'express';
import { initSequelize } from './util/database';
import { BoatController } from './controller/boat.controller';
import { SkipperController } from './controller/skipper.controller';
import { addCorsHeaders } from './middleware/cors';
import { boatRoutes } from './routes/boat.routes';
import { skipperRoutes } from './routes/skipper.routes';
import { ImageController } from './controller/image.controller';
import { imageRoutes } from './routes/image.routes';
import { MessageController } from './controller/message.controller';
import { addMessageRoute } from './routes/message.routes';
import { UserController } from './controller/user.controller';
import { userRoutes } from './routes/user.routes';
import * as path from 'path';
import { Server } from 'http';
import { rentalRoutes } from './routes/rental.routes';
import { RentalController } from './controller/rental.controller';
import { LoginController } from './controller/login.controller';
import { loginRoutes } from './routes/login.routes';
import { FineController } from './controller/fine.controller';
import { fineRoutes } from './routes/fine.routes';
import cookieParser from 'cookie-parser';

initSequelize();

const boatController: BoatController = new BoatController();
const skipperController: SkipperController = new SkipperController();
const rentalController: RentalController = new RentalController();
const imageController: ImageController = new ImageController();
const messageController: MessageController = new MessageController();
const userController: UserController = new UserController();
const loginController: LoginController = new LoginController();
const fineController: FineController = new FineController();

export const app: Application = express();
const port = +(process.env.SRV_PORT ?? 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addCorsHeaders);
app.use(cookieParser());

// Statically serve images.
app.use('/images', express.static(path.join(__dirname, '..', 'media')));

// Routes
app.use(boatRoutes(boatController));
app.use(skipperRoutes(skipperController));
app.use(rentalRoutes(rentalController));
app.use(imageRoutes(imageController));
addMessageRoute(app, messageController);
app.use(userRoutes(userController));
app.use(loginRoutes(loginController));
app.use(fineRoutes(fineController));

app.get('/', (_req, res) => {
  res.json({ status: 'online' });
});

export let server: Server;

try {
  server = app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: unknown) {
  console.error(`Error occurred: ${(error as Error).message}`);
}

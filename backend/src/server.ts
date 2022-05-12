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
import { authenticator } from './middleware/auth';

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
app.use(authenticator);

// Statically serve images.
app.use('/images', express.static(path.join(__dirname, '..', 'media')));

// Routes
app.use('/boats', boatRoutes(boatController));
app.use(skipperRoutes(skipperController));
app.use('/rentals', rentalRoutes(rentalController));
app.use('/images', imageRoutes(imageController));
addMessageRoute(app, messageController);
app.use(fineRoutes(fineController));
app.use('/users', userRoutes(userController));
app.use('/login', loginRoutes(loginController));

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

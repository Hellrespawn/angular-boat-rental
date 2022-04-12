import 'dotenv/config';
import express, { Application } from 'express';
import { initSequelize } from './util/database';
import { BoatController } from './controller/boat.controller';
import { SkipperController } from './controller/skipper.controller';
import { addCorsHeaders } from './middleware/cors';
import { addBoatRoutes as boatRoutes } from './routes/boat.routes';
import { addSkipperRoutes as skipperRoutes } from './routes/skipper.routes';
import { ImageController } from './controller/image.controller';
import { imageRoutes } from './routes/image.routes';

initSequelize();

const boatController: BoatController = new BoatController();
const skipperController: SkipperController = new SkipperController();
const imageController: ImageController = new ImageController();

const app: Application = express();
const port = +(process.env.SRV_PORT ?? 3000);

app.use(addCorsHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(boatRoutes(boatController));
app.use(skipperRoutes(skipperController));
app.use(imageRoutes(imageController));

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: unknown) {
  console.error(`Error occurred: ${(error as Error).message}`);
}

import 'dotenv/config';
import express, { Application } from 'express';
import { initSequelize } from './util/database';
import { BoatController } from './controller/boat.controller';
import { SkipperController } from './controller/skipper.controller';
import { addCorsHeaders } from './middleware/cors';
import { addBoatRoutes } from './routes/boat.routes';
import { addSkipperRoutes } from './routes/skipper.routes';
import { ImageController } from './controller/image.controller';
import { addImageRoutes } from './routes/image.routes';

initSequelize();

const boatController: BoatController = new BoatController();
const skipperController: SkipperController = new SkipperController();
const imageController: ImageController = new ImageController();

const app: Application = express();
const port = +(process.env.SRV_PORT ?? 3000);

app.use(addCorsHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

addBoatRoutes(app, boatController);
addSkipperRoutes(app, skipperController);
addImageRoutes(app, imageController);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: unknown) {
  console.error(`Error occurred: ${(error as Error).message}`);
}

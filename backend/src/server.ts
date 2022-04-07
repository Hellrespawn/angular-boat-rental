import 'dotenv/config';
import express, { Application } from 'express';
import { initSequelize } from './util/database';
import { BoatController } from './controller/boat.controller';
import { SkipperController } from './controller/skipper.controller';
import { addCorsHeaders } from './middleware/cors';
import { addBoatRoutes } from './routes/boat.routes';
import { addSkipperRoutes } from './routes/skipper.routes';

initSequelize();

const boatController: BoatController = new BoatController();
const skipperController: SkipperController = new SkipperController();

const app: Application = express();
const port = +(process.env.SRV_PORT ?? 3000);

app.use(addCorsHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

addBoatRoutes(app, boatController);
addSkipperRoutes(app, skipperController);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: unknown) {
  console.error(`Error occured: ${(error as Error).message}`);
}

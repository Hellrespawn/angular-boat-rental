import express, { Application } from "express";
import { initSequelize } from "./util/database";

import { BoatController } from "./controllers/boat-controller";
import { SkipperController } from "./controllers/skipper-controller";

initSequelize();

const boatController: BoatController = new BoatController();
const skipperController: SkipperController = new SkipperController();

const app: Application = express();
const port = 3000;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/boat", (req: express.Request, res: express.Response): void => {
    boatController.getBoats(req, res);
});

app.get("/skipper", (req: express.Request, res:express.Response): void => {
  skipperController.getSkippers(req, res);
});

app.post("/boat", async (req: express.Request, res: express.Response):Promise<void> => {
    boatController.addBoat(req, res);
});

app.post("/skipper", async (req: express.Request, res: express.Response):Promise<void> => {
  skipperController.addSkipper(req, res);
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}

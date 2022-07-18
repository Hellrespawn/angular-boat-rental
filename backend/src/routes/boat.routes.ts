/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { BoatController, NEW_BOAT_SCHEMA } from '../controller/boat.controller';
import { requireAdminRights } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';
import { Validator } from '../util/validator';
import multer from 'multer';

export const UPLOAD = multer();

const newBoatValidator = new Validator(NEW_BOAT_SCHEMA);

export function getBoatRouter(): Router {
  const boatController = BoatController.getInstance();
  const router = Router();

  router.get('/overview', boatController.getOverviewData.bind(boatController));

  // Get all available boats between dates.
  router.get(
    '/overview/available/:dateStart/:dateEnd',
    boatController.getAvailableOverviewData.bind(boatController)
  );

  router.get(
    '/:id/detail',
    validateIdInUrlParams(),
    boatController.getDetailData.bind(boatController)
  );

  router.get(
    '/:id/bookedDates',
    validateIdInUrlParams(),
    boatController.getBookedDates.bind(boatController)
  );

  router.post(
    '/',
    requireAdminRights,
    UPLOAD.single('image'),
    (req, res, next) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        res.status(400).json({
          error: 'Malformed JSON string!',
          source: req.body,
          originalError: (error as Error).message,
        });
        return;
      }

      next();
    },
    newBoatValidator.middleware(),
    boatController.save.bind(boatController)
  );

  router.delete(
    '/:id',
    validateIdInUrlParams(),
    requireAdminRights,
    boatController.delete.bind(boatController)
  );

  return router;
}

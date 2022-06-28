/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { BoatController, NEW_BOAT_SCHEMA } from '../controller/boat.controller';
import { requireAdminRights } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';
import { Validator } from '../util/validator';

const newBoatValidator = new Validator(NEW_BOAT_SCHEMA);

export function getBoatRouter(): Router {
  const boatController = BoatController.getInstance();
  const router = Router();

  router.get(
    '/overview',
    boatController.getBoatsOverviewData.bind(boatController)
  );

  // Get all available boats between dates.
  router.get(
    '/overview/available/:dateStart/:dateEnd',
    boatController.getAvailableBoatsOverviewData.bind(boatController)
  );

  router.get(
    '/:id/detail',
    validateIdInUrlParams(),
    boatController.getBoatDetailData.bind(boatController)
  );

  router.get(
    '/:id/bookedDates',
    validateIdInUrlParams(),
    boatController.getBookedDates.bind(boatController)
  );

  router.post(
    '/',
    requireAdminRights,
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

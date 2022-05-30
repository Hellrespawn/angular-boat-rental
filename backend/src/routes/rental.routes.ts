import { Router } from 'express';
import {
  NEW_RENTAL_SCHEMA,
  RentalController,
} from '../controller/rental.controller';
import { requireAuthentication } from '../middleware/auth';
import { Validator } from '../util/validator';

const newRentalValidator = new Validator(NEW_RENTAL_SCHEMA);

export function rentalRoutes(controller: RentalController): Router {
  const router = Router();

  router.post(
    '/',
    requireAuthentication,
    newRentalValidator.middleware(),
    controller.addRental.bind(controller)
  );

  router.get('/upcoming');
  router.get('/current');
  router.get('/past');

  return router;
}

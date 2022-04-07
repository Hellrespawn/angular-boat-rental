import Ajv, { JSONSchemaType } from 'ajv';
import { NextFunction, Request, Response } from 'express';

// Initialize single Ajv instance
// allErrors reports all errors, not just the first.
const ajv = new Ajv({ allErrors: true });

/**
 * Create validator middleware from schema. Use the output of this function in
 * your route.
 */
export function createValidatorFromSchema<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    if (validate(req.body)) {
      next();
    } else {
      res.status(400).json(validate.errors);
    }
  };
}

/**
 * Middleware to check the ID in the url.
 */
export function validateIdInUrlParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0) {
    res
      .status(400)
      .json({ message: 'ID is not a valid number!', id: req.params.id });
  } else {
    next();
  }
}

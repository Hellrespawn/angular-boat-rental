import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { NextFunction, Request, Response } from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

/**
 * Initialize single, central Ajv instance.
 *
 * allErrors reports all errors, not just the first.
 */
const AJV = new Ajv({ allErrors: true });

export function createValidatorFromSchema<T>(
  schema: JSONSchemaType<T>
): ValidateFunction<T> {
  return AJV.compile(schema);
}

/**
 * Create validator middleware from schema. Use the output of this function in
 * your route.
 */
export function createMiddlewareFromValidator<T>(
  validator: ValidateFunction<T>
): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    if (validator(req.body)) {
      next();
    } else {
      res.status(400).json(validator.errors);
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
      .json({ message: 'ID must be a positive integer!', id: req.params.id });
  } else {
    next();
  }
}

import Ajv from "ajv";
import { NextFunction, Request, Response } from "express";

// Initialize single Ajv instance
// allErrors reports all errors, not just the first.
const ajv = new Ajv({ allErrors: true });

// Quick type definition for JSON schema. Avoids the generic with Ajv's built-
// in JSONSchemaType.
type JSONPrimitive =
  | string
  | number
  | boolean
  | JSONPrimitive[]
  | { [key: string]: JSONPrimitive };

export type JSONSchema = { [key: string]: JSONPrimitive };

/**
 * Create validator middleware from schema. Use the output of this function in
 * your route.
 */
export function createValidatorFromSchema(schema: JSONSchema) {
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
  if (isNaN(+req.params.id)) {
    res
      .status(400)
      .json({ message: "ID is not a valid number!", id: req.params.id });
  } else {
    next();
  }
}

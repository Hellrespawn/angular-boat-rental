import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../middleware';

/**
 * Initialize single, central Ajv instance.
 *
 * allErrors reports all errors, not just the first.
 */
const AJV = new Ajv({ allErrors: true });

/** Add string formats to Ajv. */
addFormats(AJV);

/**
 * Validator class using strategy pattern for validation.
 */
export class Validator<T> {
  private validator: ValidateFunction<T>;

  constructor(schema: JSONSchemaType<T>) {
    this.validator = AJV.compile(schema);
  }

  public validate(data: unknown): data is T {
    return this.validator(data);
  }

  public getErrors():
    | ErrorObject<string, Record<string, T>, unknown>[]
    | null
    | undefined {
    return this.validator.errors;
  }

  public middleware(): Middleware {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (this.validate(req.body)) {
        next();
      } else {
        res.status(400).json(this.getErrors());
      }
    };
  }
}

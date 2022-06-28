import { Response } from 'express';

export enum ErrorType {
  Client = 400,
  Forbidden = 401,
  Server = 500,
}

/**
 * Error class, which encapsulates the type of error and HTML response code.
 */
export class ServerError extends Error {
  public errorType: ErrorType;

  constructor(message: string, errorType?: ErrorType) {
    super(message);
    this.errorType = errorType ?? ErrorType.Client;
  }

  /**
   * Handles response for ServerError or generic error
   * @param error
   * @param res
   */
  public static respond(error: unknown, res: Response): void {
    const status = error instanceof ServerError ? error.errorType : 500;

    const response = { error: error instanceof Error ? error.message : error };

    res.status(status).json(response);
  }
}

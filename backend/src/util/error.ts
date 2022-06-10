import { Response } from 'express';

export enum ErrorType {
  Client = 400,
  Forbidden = 401,
  Server = 500,
}

export class ServerError extends Error {
  public errorType: ErrorType;

  constructor(message: string, errorType?: ErrorType) {
    super(message);
    this.errorType = errorType ?? ErrorType.Client;
  }

  public static async respond(error: unknown, res: Response): Promise<void> {
    if (error instanceof ServerError) {
      res.status(error.errorType).json({ error: error.message });
    } else {
      res.status(500).json({ error });
    }
  }
}

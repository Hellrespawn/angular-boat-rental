import { Response } from 'express';

export enum ErrorType {
  Client = 400,
  Forbidden = 401,
  Server = 500,
}

export class ServerError {
  public errorType: ErrorType;

  constructor(public message: string, errorType?: ErrorType) {
    this.errorType = errorType ?? ErrorType.Client;
  }

  public static async respond(error: unknown, res: Response): Promise<void> {
    console.error(error);

    if (error instanceof ServerError) {
      res.status(error.errorType).json({ error: error.message });
    } else {
      res.status(500).json({ error });
    }
  }
}
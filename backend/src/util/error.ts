import { Response } from 'express';

export enum ErrorType {
  Client = 400,
  Forbidden = 401,
  Server = 500,
}

export class ServerError {
  constructor(public message: string, public errorType?: ErrorType) {}

  public static async respond(error: unknown, res: Response): Promise<void> {
    console.error(error);

    if (error instanceof ServerError) {
      const errorType = error.errorType ?? ErrorType.Client;
      res.status(errorType).json({ error: error.message });
    } else {
      res.status(500).json({ error });
    }
  }
}

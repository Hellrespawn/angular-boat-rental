import 'dotenv/config';

import * as path from 'path';
import { Server } from 'http';

import express, { Application } from 'express';
import cookieParser from 'cookie-parser';

import { initSequelize } from './database';
import { ROUTERS } from './routes';
import { addCorsHeaders } from './middleware/cors';
import { authenticator } from './middleware/auth';
import { getEnvVar } from './util/env';

const { SRV_PORT } = getEnvVar();
const port = parseInt(SRV_PORT);

initSequelize();

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addCorsHeaders);
app.use(cookieParser());
app.use(authenticator);

// Statically serve images.
app.use('/images', express.static(path.join(__dirname, '..', 'media')));

// Routes
ROUTERS.forEach(({ prefix, router }) => app.use(prefix, router));

export let server: Server;

try {
  server = app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: unknown) {
  console.error(`Error occurred: ${(error as Error).message}`);
}

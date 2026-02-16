import 'dotenv/config';

import express from 'express';
import path from 'path';
import routes from '../routes/index.js';
import ErrorHandler from "../middlewares/error.js";

const app = express();

app.use(express.json());
app.use('/covers', express.static(path.join(process.cwd(), 'cover')));
app.use(routes);

app.use(ErrorHandler);

export default app;

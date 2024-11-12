import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import api from './routes/api';
import { errorHandler } from '@eventexchange/common';
import cors from 'cors';
dotenv.config();
export const app = express();

// Important middlewares
app.use(express.json());

app.use(cors());

// Router mounting
app.use('/api', api);

// Error handling
app.use(errorHandler);

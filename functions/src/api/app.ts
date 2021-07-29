import express from "express";
import {router as v1} from "./routes/route.api1";

export const app = express();

// CORS

// Middleware (Mostly Authentication)

// Routes
app.use('/v1', v1);



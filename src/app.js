
import express, { json, urlencoded } from 'express';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from './config/passport.js';

import { createSessionMW } from "./config/session.js";
import { sessionRoutes }  from  "./routes/sessions.routes.js";
import { protectedRoutes }   from  "./routes/protected.routes.js";
import { usersRouter } from "./routes/users.routes.js";

import erroHandler from "./middlewares/error.handler.js";

const app = express();

//middlewares base
app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(morgan("dev")); //Logs https
app.use(json());
app.use(urlencoded({ extended: true }));

//Sesiones
app.use(cookieParser());
app.use(createSessionMW());

//Passport
app.use(passport.initialize());
app.use(passport.session());

//health, ruta para ver que la api esta en funcionamiento
app.get("/health", (_req,res)=> res.json({ok:true}));

//Router
app.use("/api/sessions", sessionRoutes);
app.use("/private", protectedRoutes);
app.use("/api/users", usersRouter);


//404
app.use( (_req, res) => res.status(404).json({ message: 'Page not found' }) );

//Manejo de errores
app.use(erroHandler);

export default app;
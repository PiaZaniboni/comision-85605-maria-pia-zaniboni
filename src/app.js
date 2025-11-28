
import express, { json, urlencoded } from 'express';
import morgan from "morgan";
import cors from "cors";

import { usersRouter } from "./routes/users.routes.js";
import { erroHandler } from "./middlewares/error.handler.js";

const app = express();

//middlewares base
app.use(cors());
app.use(json());
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));

//health
app.get("/health", (req,res)=> res.json({ok:true}));

//Router
app.use("/api/users", usersRouter);

//Manejo de errores
app.use(erroHandler);

export default app;
import "reflect-metadata";
import express, { Request, Response } from "express";
import path from "path";
import {
  useExpressServer,
  useContainer as useRouteContainer,
} from "routing-controllers";
import dotenv from "dotenv";
import logger from "morgan";

import { StudentRepository } from "./api/repositories/StudentRepository";
import StudentService from "./api/services/StudentService";
import StudentController from "./api/controllers/Student";
import { Container } from "typedi";

dotenv.config();

const app = express();
// EJS
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(
  express.static(path.join(__dirname, "/public"), { maxAge: 31557600000 })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(logger("dev"));

// useRouteContainer(Container);
useExpressServer(app, {
  routePrefix: "/api",
  controllers: [StudentController],
});
// app.use("/students", studentController.routes());
app.get("/", (req: Request, res: Response) => {
  res.send(`<div>Welcome to Firdaus API Server<br/> </div>`);
});

const PORT = process.env.PORT || 4000;
const start = () => {
  app.listen(PORT, () => {
    console.log(
      `Server ⚡ is running on http://localhost:${PORT} Environment: ${process.env.NODE_ENV}`
    );
  });
};
start();

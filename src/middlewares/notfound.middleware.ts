import { Request, Response } from "express";

export const NotFound = (req: Request, res: Response) =>
  res.status(404).send("Route does not exist");

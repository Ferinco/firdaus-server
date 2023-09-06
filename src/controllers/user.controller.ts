import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const data = await UserService.getUser(id);
  res.status(StatusCodes.OK).send({ message: "success", data });
};
export const createUser = async (req: Request, res: Response) => {
  const { body } = req;
  const data = await UserService.createUser(body);
  res.status(StatusCodes.OK).send({ message: "success", data });
};

export const getUsers = async (req: Request, res: Response) => {
  const data = await UserService.getUsers();
  res.status(StatusCodes.OK).send({ message: "success", data });
};

export const deleteUser = async (req: Request, res: Response) => {
  const {
    params: { id },
  } = req;
  const data = await UserService.deleteUser(id);
  res.status(StatusCodes.OK).send({ message: "success", data });
};

export const updateUser = async (req: Request, res: Response) => {
  const {
    params: { id },
    body,
  } = req;
  const data = await UserService.updateUser(id, body);
  res.status(StatusCodes.OK).send({ message: "success", data });
};
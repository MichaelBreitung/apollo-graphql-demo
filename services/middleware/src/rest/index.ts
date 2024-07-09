import { Router, Request, Response } from "express";

import type { IUsers, TNewUserData } from "../data";

import Users from "./UserService";

function sendResult(result: any, res: Response) {
  return res.status(200).json(result);
}

function sendError(error: any, code: number, res: Response) {
  return res.status(code).json(error);
}

function userFromData(userData: any): TNewUserData | null {
  if (userData.name && userData.surname) {
    return userData as TNewUserData;
  }
  return null;
}

export function getRouter(users: IUsers) {
  const router = Router();
  const usersService = new Users(users);

  router.get("/users", async (_req: Request, res: Response) => {
    const users = await usersService.getUsers();
    sendResult(users, res);
  });

  router.get("/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    if (id) {
      const user = await usersService.getUser(Number(id));
      sendResult(user, res);
    } else {
      sendError("REST GET /users/id -> Invalid Request", 400, res);
    }
  });

  router.post("/users", async (req: Request, res: Response) => {
    const newUser = userFromData(req.body);

    if (newUser) {
      const createdUser = await usersService.addUser(newUser);
      sendResult(createdUser, res);
    } else {
      sendError("REST POST /users -> Invalid Request", 400, res);
    }
  });

  router.put("/users/:id/friends", async (req: Request, res: Response) => {
    const userId = req.params.id;
    const friendId = req.body.friendId;

    if (typeof friendId === "number" && userId) {
      const createdUser = await usersService.makeFriends(
        Number(userId),
        friendId
      );
      sendResult(createdUser, res);
    } else {
      sendError("REST POST /users -> Invalid Request", 400, res);
    }
  });

  router.delete("/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    if (id) {
      const deleted = await usersService.getUser(Number(id));
      sendResult(deleted, res);
    } else {
      sendError("REST DELETE /users/id -> Invalid Request", 400, res);
    }
  });

  return router;
}

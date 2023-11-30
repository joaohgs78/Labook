// Importe as classes necessárias,
import express from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDataBase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const userRouter = express.Router();


const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
)
// Adicione as rotas ao router
// userRouter.get("/", userController.getUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
// userRouter.put("/:id", userController.putUsers);
// userRouter.delete("/:id", userController.deleteUsers);

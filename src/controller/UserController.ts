import { UserBusiness} from './../business/UserBusiness';
import { Request, Response } from "express";
import { UserDatabase } from "../database/UserDataBase";
import { TUserDB } from "../types";
import { User } from "../models/users";


export class UserController {

    public getUsers = async (req: Request, res: Response) => {
        try {
          const input = {
            q: req.query.q as string
          }
    
          const userBusiness = new UserBusiness()
          const output = await userBusiness.getUser(input)
    
          res.status(200).send(output);
        } catch (error) {
          console.log(error);
    
          if (res.statusCode === 200) {
            res.status(500);
          }
    
          if (error instanceof Error) {
            res.send(error.message);
          } else {
            res.send("Erro inesperado");
          }
        }
      };


    public postUsers = async (req:Request, res:Response) => {
      
            try {
              const input = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.id,
                role: req.body.role
              }
        
              const userBusiness = new UserBusiness()
              const output = await userBusiness.postUsers(input)
        
              res.status(201).send(output);
            } catch (error) {
              console.log(error);
        
              if (req.statusCode === 200) {
                res.status(500);
              }
        
              if (error instanceof Error) {
                res.send(error.message);
              } else {
                res.send("Erro inesperado");
              }
    }
}
    public putUsers = async (req:Request, res: Response) => {
        try {
            
    
            const input = {
                id:req.params.id,
                name:req.body.name,
                password: req.body.password,
                email: req.body.email,
                role: req.body.role
            }

            const userBusiness = new UserBusiness()
            const output = await userBusiness.putUsers(input)

           
    
            res.status(200).send(`Usuário ${output.name} atualizado com sucesso`);

        } catch (error) {
            console.log(error);
    
            if (res.statusCode === 200) {
                res.status(500);
            }
    
            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    }
    
    public deleteUsers = async (req:Request, res:Response) => {
        try {
            // const { id } = req.params;

            const input = {
                id:req.params.id
            }

            const userBusiness = new UserBusiness()
            const output = await userBusiness.deleteUser(input)
        
            res.status(200).send(`Usuário ${output.name} excluído com sucesso`);
          } catch (error) {
            console.log(error);
        
            if (res.statusCode === 200) {
              res.status(500);
            }
        
            if (error instanceof Error) {
              res.send(error.message);
            } else {
              res.send("Erro inesperado");
            }
          }
    }
}


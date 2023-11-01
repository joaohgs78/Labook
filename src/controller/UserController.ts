import { Request, Response } from "express";
import { UserDatabase } from "../database/UserDataBase";
import { TUserDB } from "../types";
import { User } from "../models/users";

export class UserController {
    public getUsers = async (req:Request, res: Response) => {

        try {
            const q = req.query.q as string;
        
            const userDatabase = new UserDatabase();
            const usersDB = await userDatabase.findUsers(q);
        
            const users: User[] = usersDB.map((userDB: TUserDB) => new User(
              userDB.id,
              userDB.name,
              userDB.email,
              userDB.password,
              userDB.role,
              userDB.created_at
            ));
        
            res.status(200).send(users);
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

    public postUsers = async (req:Request, res:Response) => {
        try {
            const { id, name, email, password, role } = req.body
    
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
    
            if (typeof name !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }
    
            if (typeof email !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
            }
    
            if (typeof password !== "string") {
                res.status(400)
                throw new Error("'password' deve ser string")
            }
    
            if (typeof role !== "string") {
                res.status(400)
                throw new Error("'password' deve ser string")
            }
    
            
    
            const userDatabase = new UserDatabase()
            const userDBExists = await userDatabase.findUserById(id)
    
            if (userDBExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }
    
            const newUser = new User(
                id,
                name,
                email,
                password,
                role,
                new Date().toISOString()
            ) 
    
            const newUserDB: TUserDB = {
                id: newUser.getId(),
                name: newUser.getName(),
                email: newUser.getEmail(),
                password: newUser.getPassword(),
                role: newUser.getRole(),
                created_at: newUser.getCreatedAt()
            }
    
            
            await userDatabase.insertUser(newUserDB)
    
            res.status(201).send(newUser)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
    public putUsers = async (req:Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, email, password, role } = req.body;
    
            // Verificar se os campos são do tipo string
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("'id' deve ser uma string");
            }
    
            if (typeof name !== "string") {
                res.status(400);
                throw new Error("'name' deve ser uma string");
            }
    
            if (typeof email !== "string") {
                res.status(400);
                throw new Error("'email' deve ser uma string");
            }
    
            if (typeof password !== "string") {
                res.status(400);
                throw new Error("'password' deve ser uma string");
            }
    
            if (typeof role !== "string") {
                res.status(400);
                throw new Error("'role' deve ser uma string");
            }
    
            const userDatabase = new UserDatabase();
    
            // Verificar se o usuário com o ID existe
            const userExists = await userDatabase.findUserById(id);
            if (!userExists) {
                res.status(404);
                throw new Error("Usuário não encontrado");
            }
    
            // Atualizar os dados do usuário
            userExists.name = name;
            userExists.email = email;
            userExists.password = password;
            userExists.role = role;
    
            // Salvar as mudanças no banco de dados
            await userDatabase.updateUser(userExists);
    
            res.status(200).send("Usuário atualizado com sucesso");
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
            const { id } = req.params;
        
            if (typeof id !== "string") {
              res.status(400);
              throw new Error("'id' deve ser uma string");
            }
        
            const userDatabase = new UserDatabase();
        
            // Verificar se o usuário com o ID existe
            const userExists = await userDatabase.findUserById(id);
            if (!userExists) {
              res.status(404);
              throw new Error("Usuário não encontrado");
            }
        
            // Remover o usuário do banco de dados
            await userDatabase.deleteUser(id);
        
            res.status(200).send("Usuário excluído com sucesso");
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


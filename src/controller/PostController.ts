import { PostBusiness} from './../business/PostBusiness';
import { Request, Response } from "express";
import { PostDatabase } from "../database/PostsDataBase";
import { TPostDB } from "../types";
import { UserDatabase } from "../database/UserDataBase";
import { format } from 'date-fns';


export class PostController {
    
  public getPosts = async (req: Request, res: Response) => {
    try {

      const postBusiness = new PostBusiness()
      const reponse = await  postBusiness.getPosts()

      res.status(200).send(reponse);
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



  public postPost = async (req: Request, res: Response) => {
    try {
     
        const input = {
          id:req.body.id,
          creator_id:req.body.creator_id,
          content: req.body.content,
          likes: req.body.likes,
          dislikes: req.body.dislikes
        }

        const postBusiness = new PostBusiness()
        const output = await postBusiness.postPost(input)



        
        res.status(201).send(`Post de ${output?.name} criado com sucesso! `);
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


public putPost = async (req: Request, res: Response) => {
    try {
        


        const input = {
          id: req.body.id,
          creator_id: req.body.creator_id,
          content: req.body.content,
          likes: req.body.likes,
          dislikes: req.body.dislikes,
          created_at: req.body.created_at,
          updated_at: req.body.updated_at
        };

        const postBusiness = new PostBusiness()
        const output = await postBusiness.putPost(input)
        

        res.status(200).send(`Post de ${output?.creator_id} atualizado com sucesso! `);
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
};

public deletePost = async (req: Request, res: Response) => {
    try {
   
      const input = {
        postId: req.params.id
      }

      const postBusiness = new PostBusiness()
      const output = await postBusiness.deletePost(input)
     

      res.status(200).send(`Post ${output.id} excluído com sucesso'`);
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


}

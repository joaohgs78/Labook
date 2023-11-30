import express from 'express'

import { PostBusiness } from '../business/PostBusiness'
import { PostDatabase } from '../database/PostsDataBase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostController } from '../controller/PostController'

export const postRouter = express.Router()

const postController = new PostController(
  new PostBusiness(
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getPost);
postRouter.put("/:id", postController.editPost);
postRouter.delete("/:id", postController.deletePost);
postRouter.put("/:id/like", postController.likeOrDislikePost);
// Adicione esta linha na sua configuração de rotas



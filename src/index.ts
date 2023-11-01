import express, { Request, Response } from 'express';
import cors from 'cors';
import { UserController } from './controller/UserController';
import { PostController } from './controller/PostController';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3003; // Adicione uma constante para o número da porta

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

/* ENDPOINST USERS */

const userController = new UserController()

app.get("/users",userController.getUsers)

  
app.post("/users", userController.postUsers)


app.put("/users/:id", userController.putUsers)


app.delete("/users/:id", userController.deleteUsers)
  

  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

  /* ENDPOINTS POSTS */

  const postController = new PostController()

app.get("/posts", postController.getPosts)

app.post("/posts", postController.postPost)

app.put("/posts", postController.putPost)

app.delete("/posts/:id", postController.deletePost)
  


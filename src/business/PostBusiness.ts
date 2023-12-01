import { PostDatabase } from "../database/PostsDataBase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/posts/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/posts/deletePosts.dto";
import {
  EditPostInputDTO,
  EditPostOutputDTO,
} from "../dtos/posts/editPosts.dto";
import {
  GetPostsInputDTO,
  GetPostOutputDTO,
} from "./../dtos/posts/getPosts.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/posts/likeOrDislike.dto";
import { ForbiddenError } from "../erros/ForbiddenError";
import { NotFoundError } from "../erros/NotFoundError";
import { UnauthorizedError } from "../erros/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/posts";
import { USER_ROLES } from "../models/users";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { BadRequestError } from "../erros/BadRequestError";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    console.log('Input:', input);
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
      
    }

    console.log('Content:', content);

    const id = this.idGenerator.generate();

    if (content === undefined) {
      throw new BadRequestError('Content is required'); 
    }
    
    const post = new Post(
      id,                                     
      content,
      0,
      0,
      new Date().toISOString(),
      payload.id,
      new Date().toISOString(),
      payload.name
    );
    const postDB = post.toDBModel();
    await this.postDatabase.insertPost(postDB);

    const output: CreatePostOutputDTO = undefined;

    return output;
  };

  public getPost = async (
    input: GetPostsInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postCreatorName = await this.postDatabase.getPostCreatorName();

    const post = postCreatorName.map((postCreatorName) => {
      const post = new Post(
        postCreatorName.id,
        postCreatorName.content,
        postCreatorName.likes,
        postCreatorName.dislikes,
        postCreatorName.created_at,
        postCreatorName.creator_id,
        postCreatorName.updated_at,
        
        postCreatorName.creator_name
      );

      return post.toBusinessModel();
    });

    const output: GetPostOutputDTO = post;

    return output;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDatabase.findPostById(idToEdit);

    if (!postDB) {
      throw new NotFoundError("post com essa id não existe");
    }

    if (payload.id !== postDB.creator_id) {
      throw new ForbiddenError("somente quem criou a post pode editá-la");
    }

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.creator_id,
      postDB.updated_at,
      payload.name
    );

    post.setContent(content);

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatedPostDB);

    const output: EditPostOutputDTO = undefined;

    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDatabase.findPostById(idToDelete);

    if (!postDB) {
      throw new NotFoundError("post com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("somente quem criou a post pode editá-la");
      }
    }

    await this.postDatabase.deletePostById(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

//   public likeOrDislikePost = async (
//     input: LikeOrDislikePostInputDTO
//   ): Promise<LikeOrDislikePostOutputDTO> => {
//     const { token, like, postId } = input;

//     const payload = this.tokenManager.getPayload(token);

//     if (!payload) {
//       throw new UnauthorizedError();
//     }

//     const postCreatorName = await this.postDatabase.findPostCreatorNameById(
//       postId
//     );

//     if (!postCreatorName) {
//       throw new NotFoundError("playlist com essa id não existe");
//     }

//     const post = new Post(
//       postCreatorName.id,
//       postCreatorName.content,
//       postCreatorName.likes,
//       postCreatorName.dislikes,
//       postCreatorName.created_at,
//       postCreatorName.creator_id,
//       postCreatorName.updated_at,
//       postCreatorName.creator_name
//     );

//     const likeSQlite = like ? 1 : 0;

//     const likeDislikeDB: LikeDislikeDB = {
//       user_id: payload.id,
//       post_id: postId,
//       like: likeSQlite,
//     };

//     const likeDislikeExists = await this.postDatabase.findLikeDislike(
//       likeDislikeDB
//     );

//     if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
//       if (like) {
//         await this.postDatabase.removeLikeDislike(likeDislikeDB);
//         post.removeLike();
//       } else {
//         await this.postDatabase.updateLikeDislike(likeDislikeDB);
//         post.removeLike();
//         post.addDislike();
//       }
//     } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
//       if (like === false) {
//         await this.postDatabase.removeLikeDislike(likeDislikeDB);
//         post.removeDislike();
//       } else {
//         await this.postDatabase.updateLikeDislike(likeDislikeDB);
//         post.removeDislike();
//         post.addLike();
//       }
//     } else {
//       await this.postDatabase.insertLikeDislike(likeDislikeDB);
//       like ? post.addLike() : post.addDislike();
//     }

//     console.log('like:', like);
//     console.log('likeDislikeExists:', likeDislikeExists);
//     console.log('post before modifications:', post);

//     const updatedPlaylistDB = post.toDBModel();
//     await this.postDatabase.updatePost(updatedPlaylistDB);

//     const output: LikeOrDislikePostOutputDTO = undefined;

//     return output;


//   };
// 

public likeOrDislikePost = async (
  input: LikeOrDislikePostInputDTO
): Promise<LikeOrDislikePostOutputDTO> => {
  const { token, like, postId } = input;

  const payload = this.tokenManager.getPayload(token);

  if (!payload) {
    throw new UnauthorizedError();
  }

  const postCreatorName = await this.postDatabase.findPostCreatorNameById(
    postId
  );

  if (!postCreatorName) {
    throw new NotFoundError("Post com esse ID não existe");
  }

  const post = new Post(
    postCreatorName.id,
    postCreatorName.content,
    postCreatorName.likes,
    postCreatorName.dislikes,
    postCreatorName.created_at,
    postCreatorName.creator_id,
    postCreatorName.updated_at,
    postCreatorName.creator_name
  );

  const likeSQlite = like ? 1 : 0;

  

  const likeDislikeDB: LikeDislikeDB = {
    user_id: payload.id,
    post_id: postId,
    like: likeSQlite,
  };

  const likeDislikeExists = await this.postDatabase.findLikeDislike(
    likeDislikeDB
  );

  if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
    if (like) {
      await this.postDatabase.removeLikeDislike(likeDislikeDB);
      post.removeLike();
    } else {
      await this.postDatabase.updateLikeDislike(likeDislikeDB);
      post.removeLike();
      post.addDislike();
    }
  } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
    if (like === false) {
      await this.postDatabase.removeLikeDislike(likeDislikeDB);
      post.removeDislike();
    } else {
      await this.postDatabase.updateLikeDislike(likeDislikeDB);
      post.removeDislike();
      post.addLike();
    }
  } else {
    await this.postDatabase.insertLikeDislike(likeDislikeDB);
    like ? post.addLike() : post.addDislike();
  }

  const updatedPostDB = post.toDBModel();
  await this.postDatabase.updatePost(updatedPostDB);

  const output: LikeOrDislikePostOutputDTO = undefined;

  return output;
};



}
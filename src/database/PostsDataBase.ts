
// import { TPostDB, Tlikes_dislikesDB } from "../types";
// import { BaseDatabase } from "./BaseDatabase";

// export class PostDatabase extends BaseDatabase {
//     public static TABLE_POSTS = "posts";
//     public static TABLE_LIKES_DISLIKES = "likes_dislikes"

//     //get all posts
//     public async getPosts(): Promise<TPostDB[]> {
//         const postsDB: TPostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS);
//         return postsDB;
//     }

  

//     // get all post id 

//     public async findPostById(id: string): Promise<TPostDB | undefined> {
//         const [postDB]: TPostDB[] | undefined[] = await BaseDatabase
//             .connection(PostDatabase.TABLE_POSTS)
//             .where({ id });
    
//         return postDB;
//     }
    


//     //post all Post
//     public async insertPost(newPost: TPostDB): Promise<void> {
//         await BaseDatabase
//         .connection(PostDatabase.TABLE_POSTS)
//         .insert(newPost)
//     }

//     // put post
//     public async updatePost(post: TPostDB): Promise<void> {
       
//             await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
//                 .where({ id: post.id })
//                 .update({
//                     creator_id: post.creator_id,
//                     content: post.content,
//                     likes: post.likes,
//                     dislikes: post.dislikes
                    
//                 });
      
//     }


//     // delete post
//     public async deletePost(id: string): Promise<void> {
//         await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
//           .where({ id })
//           .del();
//       }

//       public findLikeOrDislike = async (
//         userId: string,
//         postId: string
//       ): Promise<Tlikes_dislikesDB | undefined> => {
//         const [result]: Tlikes_dislikesDB[] = await BaseDatabase
//           .connection(PostDatabase.TABLE_LIKES_DISLIKES)
//           .select()
//           .where({
//             user_id: userId,
//             post_id: postId
//           })
    
//         return result
//       } 

//       public createLikeDislike = async (
//         userId: string,
//         postId: string,
//         like: number
//       ): Promise<void> => {
//         await BaseDatabase
//           .connection(PostDatabase.TABLE_LIKES_DISLIKES)
//           .insert({
//             user_id: userId,
//             post_id: postId,
//             like
//           })
//       }
    
//       public updateLikes = async (
//         postId: string,
//         likes: number
//       ): Promise<void> => {
//         await BaseDatabase
//           .connection(PostDatabase.TABLE_POSTS)
//           .update({ likes })
//           .where({ id: postId })
//       }
    
//       public updateDislikes = async (
//         postId: string,
//         dislikes: number
//       ): Promise<void> => {
//         await BaseDatabase
//           .connection(PostDatabase.TABLE_POSTS)
//           .update({ dislikes })
//           .where({ id: postId })
//       }
    
//       public removeLikeDislike = async (
//         postId: string,
//         userId: string
//       ): Promise<void> => {
//         await BaseDatabase
//           .connection(PostDatabase.TABLE_LIKES_DISLIKES)
//           .delete()
//           .where({
//             post_id: postId,
//             user_id: userId
//           })
//       }
    
//       public updateLikeDislike = async (
//         postId: string,
//         userId: string,
//         like: number
//       ): Promise<void> => {
//         await BaseDatabase
//           .connection(PostDatabase.TABLE_LIKES_DISLIKES)
//           .update({
//             like
//           })
//           .where({
//             post_id: postId,
//             user_id: userId
//           })
//       }


// }


import { LikeDislikeDB, POST_LIKE, PostDB, PostCreatorName } from "../models/posts"
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from './UserDataBase';

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "likes_dislikes"

  public insertPost = async (
    postDB: PostDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(postDB)
  }

  public getPostCreatorName =
    async (): Promise<PostCreatorName[]> => {

    const result = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
    
    return result as PostCreatorName[]
  }

  public findPostById = async (
    id: string
  ): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select()
      .where({ id })

    return result as PostDB | undefined
  }

  public updatePost = async (
    postDB: PostDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id })
  }

  public deletePostById = async (
    id: string
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({ id })
  }

  public findPostCreatorNameById =
    async (id: string): Promise<PostCreatorName | undefined> => {

    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })
    
    return result as PostCreatorName | undefined
  }

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> => {

    const [result]: Array<LikeDislikeDB | undefined> = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })

    if (result === undefined) {
      return undefined

    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED
      
    } else {
      return POST_LIKE.ALREADY_DISLIKED
    }
  }

  // public removeLikeDislike = async (
  //   likeDislikeDB: LikeDislikeDB
  // ): Promise<void> => {
  //   await BaseDatabase
  //     .connection(PostDatabase.TABLE_LIKES_DISLIKES)
  //     .delete()
  //     .where({
  //       user_id: likeDislikeDB.user_id,
  //       post_id: likeDislikeDB.post_id
  //     })
  // }
  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      });
  }


  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeDislikeDB)
  }
}

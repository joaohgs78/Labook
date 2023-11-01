import { TUserDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"
  

    //get all users
    public async findUsers(q: string | undefined): Promise<TUserDB[]> {
      let usersDB
  
      if (q) {
        const result: TUserDB[] = await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .where("name", "LIKE", `%${q}%`)
        
          usersDB = result
      } else {
          const result: TUserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
          
            usersDB = result
      }
  
      return usersDB
    }
  
    //get id of user
    public async findUserById(id: string) {
  
      const [ userDB ]: TUserDB[] | undefined[] = await BaseDatabase.connection(UserDatabase.TABLE_USERS).where({ id })
      return userDB
      
    }

    // post user
    public async insertUser(newUser: TUserDB): Promise<void> {
        await BaseDatabase
          .connection(UserDatabase.TABLE_USERS)
          .insert(newUser);
      }
      
      // put user
      public async updateUser(user: TUserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id: user.id })
            .update({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
            });
    }

    // delete user
    public async deleteUser(id: string): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
          .where({ id })
          .del();
      }


  }
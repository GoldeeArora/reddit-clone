
// import { Post } from "/src/entities/Post";
import { MyContext } from "src/types";
import {Post} from "../entities/Post"

import { Resolver,Query, Int, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, ObjectType } from "type-graphql";
import { FindOneOptions} from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { conn } from "../utils/DataSource"
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput{
    @Field()
    title!: string;
    @Field()
    text!: string

}
@ObjectType()
class PaginatedPosts{
    @Field(()=>[Post])
    posts!: Post[]
    @Field()
    hasMore!: boolean

}
@Resolver(Post)
export class PostResolver{
  @Mutation(()=> Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId",()=> Int) postId: number,
    @Arg("value",()=>Int) value: number,
    @Ctx(){req}: MyContext
  ){
    const  isUpdoot = value!==-1;
    const realValue = isUpdoot ? 1 :-1
 const {userId} = req.session;
 console.log("we are inside vote mutation")
 
 const updoot = await Updoot.findOne({where: {postId,userId}})
 console.log("updoot: ",updoot);
//  the user has voted on the post before and trying to change their previous vote

 if(updoot && updoot.value!==realValue)
 {
  conn.transaction(async (tm)=>{
 await tm.query(
  `update updoot 
  set value = $1
  where "postId" = $2 and "userId" = $3`,
  [realValue,postId,userId]
 )
 await  tm.query(
  ` update post
 set points = points + $1 
 where id = $2
 `,
 [2*realValue,postId]
 )
  })
 }
 else if(!updoot){
  // they have not voted before
  conn.transaction(async(tm)=>{
  await  tm.query(
    `insert into updoot ("userId","postId",value)
    values ($1,$2,$3)
    `,[userId,postId,realValue]
  )
  await  tm.query(
   ` update post
  set points = points + $1 
  where id = $2
  `,
  [realValue,postId]
  )

  })
 }
 else{
  console.log("this didn't work for some reason")
  return false

 }
// await Updoot.insert({userId,postId,value: realValue});
//   await conn.createQueryRunner().query(`
//   update post
//   set points = points + $1 
//   where id = $2
//   `,
//   [realValue,postId]
//   );
 return true;
  }

  
    @Query(()=> PaginatedPosts)
     async posts(
        @Arg("limit",()=> Int) limit: number,
        @Arg("cursor",()=> String, {nullable : true})cursor: string | null,
        @Ctx() {req}: MyContext
        
    ): Promise<PaginatedPosts>
    {
      
  const realLimit = Math.min(50,limit) 
  const realLimitPlusOne = realLimit + 1;

  

    const replacements: any[] = [realLimitPlusOne];
    req.session.userId && replacements.push(req.session.userId)
    
    if(cursor){
        replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await conn.createQueryRunner().query(`
    select p.*, u.username,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) as creator,
      ${
        req.session.userId ? `(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"`: 'null as "voteStatus"'
      }
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $${req.session.userId ? `3`: `2`}` : ""}
    order by p."createdAt" DESC
    limit $1
  `, replacements);
  

        return {posts: posts.slice(0,realLimit),hasMore: posts.length === realLimitPlusOne};
 
    }
    @Query(()=> Post,{nullable: true})
   async post(
        @Arg("id",()=>Int) id: number,
       
        ): Promise<Post | null>
    {
      const post = await conn.createQueryRunner().query(`
      select p.*, u.username,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'createdAt', u."createdAt",
          'updatedAt', u."updatedAt"
        ) as creator
      from post p
      inner join public.user u on u.id = p."creatorId"
      where p.id = $1
      order by p."createdAt" DESC
    `, [id]
    );
    console.log(post)
    return post;
        // return Post.findOne(id as any,{relations: ["creator"]})
    }

@Mutation(() => Post)
@UseMiddleware(isAuth)
async createPost(
  @Arg("input") input: PostInput,
  @Ctx() { req }: MyContext
): Promise<Post> {
  return Post.create({
    ...input,
    creatorId: req.session.userId,
  }).save();
}


    @Mutation(()=> Post,{nullable: true})
    async updatepost(
        @Arg("id") id: number,
        @Arg("title") title: string,
        
        ): Promise<Post | null>
    {
        const post = await Post.findOne(id as FindOneOptions<Post>);
        if(!post) return null;
        if(title!=='undefined') await Post.update({id},{title})
      
       
        return post;
    }
    @Mutation(()=> Boolean)
    async deletepost(
        @Arg("id") id: number,
        
        ): Promise<boolean>
    {
        try{
      await  Post.delete(id)
;        }
        catch{
            return false;
        }
        return true;
    }
}
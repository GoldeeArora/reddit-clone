


import { Field, ObjectType } from "type-graphql";
import { Entity,PrimaryColumn,BaseEntity, ManyToOne, Column } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";


@ObjectType()
@Entity()
// m to n
//  many to many 
// user <-> posts
//  user -> updoot <- posts

export class Updoot extends BaseEntity{

  @Field()
  @Column({type: "int"})
  value!: number; //It is up or down ( going to contain only two types of values 1 or -1)
  
 
  @Field()
  @PrimaryColumn()
  userId!: number;
  @Field(()=>User)
  @ManyToOne(()=> User,(user)=> user.updoots)
  user!: User;
  @Field()
  @PrimaryColumn()
  postId!: number;
  @Field(()=>Post)
  @ManyToOne(()=> Post,(post)=> post.updoots)
  post!: Post;



  
}



import { Field, ObjectType } from "type-graphql";
import { CreateDateColumn, Entity, UpdateDateColumn,Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import {Post} from "./Post"
import {Updoot} from "../entities/Updoot"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  

  
  @Field() //this exposes the field in the graphql api
  @Column({ unique: true }) // this is used to define it is variable which will be used in a database
  username!: string;
  @Field() //this exposes the field in the graphql api
  @Column({ type: "text",unique: true }) // this is used to define it is variable which will be used in a database
  email!: string;

  @Column() // this is used to define it is variable which will be used in a database
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts!: Post[];
  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots!: Updoot[];
  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;
  
  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
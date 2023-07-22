


import { Field, Int, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn,Entity, CreateDateColumn,UpdateDateColumn,Column,BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import {Updoot} from "../entities/Updoot"

@ObjectType()
@Entity()
export class Post extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field() 
  @Column() 
  title!: string;
  @Field() 
  @Column() 
  text!: string;
  @Field(()=> Int,{nullable: true})
  voteStatus!: number | null; //1 or -1 or null
  @Field() 
  @Column({type: "int", default: 0}) 
  points!: number;
  @Field()
  @Column()
  creatorId!: number;
  @Field()
  @ManyToOne(()=> User,(user)=> user.posts)
  creator!: User;
  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots!: Updoot[];
  @Field(()=> String)
  @CreateDateColumn()
  createdAt: Date | undefined;
  
  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date | undefined;
  
}
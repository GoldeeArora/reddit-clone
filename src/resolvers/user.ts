import { MyContext } from './../types';
import { User } from "../entities/User";
import { Resolver,Mutation, Field, Arg, Ctx, ObjectType, Query, FieldResolver, Root } from "type-graphql";
import argon2 from "argon2"
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { conn } from '../utils/DataSource';
@ObjectType()
class FieldError{
    @Field()
    field?: string;
    @Field()
    message?: string;
}
@ObjectType()
class UserResponse{

    @Field(()=> [FieldError],{nullable : true})
    errors?: FieldError[];
    @Field(()=> User,{nullable: true})
    user?: User;
}
@Resolver(User)
export class UserResolver{
    @FieldResolver(()=> String)
    email(@Root() user: User, @Ctx(){req}: MyContext)
    {
        if(req.session.userId === user.id)
        {
            return user.email
        }
        // current user wants to see someone elses email
        else 
        return ""
    }
    @Query(()=> User,{nullable:true})
    async me(
        @Ctx(){req}: MyContext
    ){
        // you are not logged in
        console.log(JSON.stringify(req.session) + " I am in me query backend")
        if(!req.session.userId)
        {
            return null;
        }
        // const user = await User.findOne(req.session.userId);
        const user = await conn.createQueryRunner().query(`select * from public.user where id = $1`,[req.session.userId])
        console.log("user: ", user);
        return user;
    

    }
 
    @Mutation(()=> UserResponse)
   async register(
        @Arg('options',()=>UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ) : Promise<UserResponse>
    {
       const errors = validateRegister(options);
       if(errors) return {errors}; 
const hashedPassword =await argon2.hash(options.password);
        let user = null
       try{

           
           user = await User.create({ username: options.username, email: options.email, password: hashedPassword }).save();
        }
        
        catch(err: any){
            if(err.code === '23505' || err.detail.includes('already exists'))
            {
                return {
                    errors:[{
                        field:'username',
                        message: 'username already exists'
                    }]
                }
            }

            console.log("message", err.message);
        }
        // stores user id session
        // this will set a cookie on the user
        // keep them logged in
        if(user)
        {

            req.session.userId = user.id
            console.log("I am user: ", user);
            return {user};
        }
        return {};
    
    }
    @Mutation(()=> UserResponse)
    async login(
         @Arg('usernameOrEmail') usernameOrEmail: string,
         @Arg("password") password: string,
         @Ctx() {req}: MyContext
     ) 
     : Promise<UserResponse>
     {
const user = await User.findOneBy(usernameOrEmail.includes("@") ?  {email: usernameOrEmail} :  {username: usernameOrEmail})
if(!user)
return {
    errors: [{field: "usernameOrEmail", message: "username or email doesn't exist"}]
}
const valid = await argon2.verify(user.password,password);
console.log(valid)
if(!valid)
{
    return {errors:[{field: "password", message: "Incorrect Password"}]};
}

    req.session.userId = user.id;
console.log(req.session.userId);
         return {
user,
         };
     }
     @Mutation(()=> Boolean)
     logout(
         @Ctx(){req,res}: MyContext
     )
     {
        console.log(req.session)
return new Promise(resolve => req.session.destroy((err: any) =>{
     if(err){
         console.log(err)
         console.log(COOKIE_NAME)
         resolve(false)
         return;
        }
        res.clearCookie(COOKIE_NAME);
    
   resolve(true)
 })
 );
     }


}
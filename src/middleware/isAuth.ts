import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next)=>{
     console.log("hello it is working")
     if(!context.req.session.userId)
     {
        console.log("user doesn't exist")
          throw new Error("not authenticated")
     }
     return next();
}
import "reflect-metadata"

import { __prod__, COOKIE_NAME } from "./constants";
// import { Post } from "./entities/Post";

// import path from "path"
import {ApolloServer} from "apollo-server-express"
import express from "express"
import {buildSchema} from "type-graphql"
import { HelloResolver } from "./resolvers/hello";
import {PostResolver} from "./resolvers/post"
import { UserResolver } from "./resolvers/user";
import RedisStore from "connect-redis"
import session from "express-session"
// import {createClient,RedisClientOptions} from "redis"
import cors from "cors";
import { createClient } from "redis";
import { conn } from "./utils/DataSource";




const main = async ()=>{
  // sendEmail("goldee@gmail.com","Hello my boy").catch((err)=>console.log(err))
  // const conn = await createConnection({
    //   type: 'postgres',
    //   database: 'lireddit2',
    //   username: 'postgres',
    //   password: 'Goldee@123',
    //   logging: true,
    //   synchronize: true,
    //   entities: [Post,User]
    // })
await conn.initialize()


    const app = express();

    const redis = createClient();
    redis.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redis,
  prefix: "myapp:",
  disableTouch: true
})
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

// Initialize sesssion storage.
app.use(
  session({
    name: COOKIE_NAME,
    store: redisStore,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, 
        secure: __prod__, //cookie only works in https
        sameSite: 'lax', // csrf I have changed this from lax
    },
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "qowiueojwojfalksdjoqiwueo",
  })
)
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
        resolvers: [PostResolver,HelloResolver,UserResolver],
        validate: false
    }),
    context: ({req,res})=>({req,res})
  });
  await  apolloServer.start();
  apolloServer.applyMiddleware({app,cors: false})
    app.listen(4000,()=>{
        console.log('server started on localhost:4000')
    })

    
}
main().catch((err)=>{
    console.log(err);
})


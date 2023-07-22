

import { cacheExchange } from "@urql/exchange-graphcache";
import { MeDocument, VoteMutationVariables } from "../generated/graphql.tsx/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {Exchange, fetchExchange, stringifyVariables} from "urql"
import { gql } from "graphql-tag";
import { isServer } from "./isServer";
interface PostData {
  id: number;
  points: number;
}
export const cursorPagination = ():any => {
  

  return (_parent: any, _fieldArgs: any, cache:any, info: {
    partial: any; parentKey: any; fieldName: any; fieldKey: any;
}) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info: { fieldName: any; }) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const { limit, cursor } = _fieldArgs;
    const fieldKey = `${fieldName}(${stringifyVariables(_fieldArgs)})`;
    // const isItInTheCache = cache.resolve(entityKey,fieldKey , { limit, cursor }) 
    const isItInTheCache = cache.resolve(cache.resolve(entityKey,fieldKey , { limit, cursor }) as string,"posts") 
    // console.log("isItInTheCache:", isItInTheCache)
    
    info.partial = !isItInTheCache;
    const results: string[] = [];
    const uniquePostIds = new Set<string>();
let hasMore = true;
    fieldInfos.forEach((fi: any) => {
      const key = cache.resolveFieldByKey(entityKey,fi.fieldKey) as String
      const data = cache.resolve(key,"posts") as string[];
      const _hasMore = cache.resolve(key,"hasMore");
      if(!_hasMore) hasMore = false ;
      // const data = cache.resolve(entityKey, fi.fieldName, _fieldArgs) as string[];
      // console.log(data)
      if (data) {
        data.forEach((postId) => {
          if (!uniquePostIds.has(postId)) {
            uniquePostIds.add(postId);
            results.push(postId);
          }
        });
      }
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    }
  };
};


export const createUrqlClient = (ssrExchange: any, ctx: any)=>
     {
      let cookie = ''
      if(isServer())
      cookie = ctx.req.headers.cookie
        return (
{
    
    url: "http://localhost:4000/graphql",
    fetchOptions:{
      credentials: "include" as const,
      headers: cookie ? {
cookie,
      } : undefined
    },
    exchanges: [
      cacheExchange({
        keys: {
          PaginatedPosts: ()=> null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          }
        },
        updates:{
       
          Mutation: {
            vote: (_result,_args,cache,_info)=>{
     const {postId,value} =   _args as VoteMutationVariables;
     console.log(postId + " post Id " + value + " value")
     const data = cache.readFragment(
      gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
      { id: postId } as any
    );
    console.log("data ",data)
    if(data){
      if(data.voteStatus === value) return;
      const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2)*value;

      
      cache.writeFragment<PostData>(
        gql`
    fragment __ on  Post{
      
      points
      voteStatus
    }
  `,
  { id: postId, points: newPoints,voteStatus: value } as any
  );
}
            },
            createPost:(_result,_args,cache,_info)=>{
               const allFields = cache.inspectFields('Query');
    const fieldInfos = allFields.filter((info: { fieldName: any; }) => info.fieldName === "posts");
    fieldInfos.forEach((fi)=>{
      cache.invalidate("Query","posts",fi.arguments)
    })
            
               },
            logout: (_result,_args,cache,_info)=>{
             betterUpdateQuery(
              cache,
              {query: MeDocument},
              _result,
              (): any=>({me:null})
             );
                },
            login: (_result: any, _args: any, cache: any, _info: any) => {
              
              betterUpdateQuery(cache,{query:MeDocument},_result,(result,query): any=>{
                     if(result.login.errors){
                      console.log("we got an error in login")
                      return query
                     }
                     else{
                      console.log("we have logged in with a user: ",result.login.user)
                      return {
                        me: result.login.user,
                      }
                     }
              })
             
          },
          register: (_result, _args, cache, _info) => {
              
            betterUpdateQuery(cache,{query:MeDocument},_result,(result,query): any=>{
                   if(result.register.errors){
                    return query
                   }
                   else{
                    console.log("we have registered with the user: ", result.register.user)
                    return {
                      me: result.register.user,
                    }
                   }
            })
           
        },
        },
      },
      }
      ),
  ssrExchange,
      fetchExchange
    ] as Exchange[]
} as const
        ) 

     }





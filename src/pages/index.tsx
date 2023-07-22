import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql.tsx/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

import { UpdootSection } from "../components/UpdootSection";

const Index = ()=> {
  const [variables,setVariables] = useState({limit: 7,cursor: null as null | string});
  const [{data,fetching}] = usePostsQuery(
    {
variables
    }
  )
  const posts = data?.posts;

  // console.log(posts?.posts)
  if(!fetching && !data)
  return <div>You got no data for some reason</div>
  return (
    <Layout>
      <Flex w="100%" justifyContent="space-between" alignItems="center" mb={15}>
        
      <Heading>LiReddit</Heading>
 <NextLink href="/create-post">
  <Link >Create Post</Link>
 </NextLink>
      </Flex>

    {
    (!data && fetching) ? 
    <div>loading...</div> : 
    (
      <Stack spacing={8}>
      {
      data!.posts.posts.map((p)=>
      {
        return (
          
          <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
          
          <UpdootSection post={p}/>
  <Box>

            <Heading fontSize="xl">{p.title}</Heading>
            <Text>posted by {p.creator.username}</Text>
            <Text mt={4}>{p.text.slice(0,50)}</Text>
  </Box>
          </Flex>
         
        


        )
      }
        )
}
      </Stack>
    )
    }
   {
data && data.posts.hasMore ? 
     <Flex  mt={5} >
      <Button onClick={()=>{
        setVariables((prevVariables) => ({
          ...prevVariables,
          cursor: posts!.posts[posts!.posts.length - 1]?.createdAt,
        }));
      }} m="auto" isLoading={fetching}>Load more</Button>
    </Flex> : null
    }
     </Layout>
  );
}

export default withUrqlClient(createUrqlClient,{ssr: true}) (Index);
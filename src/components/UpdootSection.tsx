import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex,Text } from '@chakra-ui/react';
import React from 'react'
import { PostSnippentFragment, useVoteMutation} from '../generated/graphql.tsx/graphql';
import { useMutation } from 'urql';

interface UpdootSectionProps {
    // post: PostsQuery['posts']['posts'][0]
    post: PostSnippentFragment


}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [,vote] = useVoteMutation();
        return (
            <Flex w={50} h={35} flexDirection="column" alignItems="center" justifyContent="space-between">

            <ChevronUpIcon h={7} w={7} onClick={async ()=>{
               if(post.voteStatus===1) return;
               await vote({
                postId: post.id,
                value: 1,
              }).then(()=>{
                console.log(post.points);
              })
            }}  cursor="pointer" color = {post.voteStatus==1  ? "green": undefined}/>
            <Text>{post.points ? post.points:  0}</Text>
            <ChevronDownIcon  h={7} w={7} onClick={ async ()=>{
              if(post.voteStatus===-1) return;
              await vote({
                postId: post.id,
                value: -1,
              })
            }} cursor="pointer" color = {post.voteStatus==-1  ? "red": undefined}/>
              </Flex>
        );
}
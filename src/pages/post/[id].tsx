import { withUrqlClient } from 'next-urql';
import React from 'react'
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql.tsx/graphql';
import { Layout } from '../../components/Layout';



export const Post = ({}) => {
    const router = useRouter();
    let intId = typeof router.query.id ==='string' ? parseInt(router.query.id) : -1;
    console.log(intId)
    const [{data,fetching}] = usePostQuery({
        pause: intId=== -1,
        variables:{
            id: intId
        }
    })
    console.log(data);
    if(fetching)
    {
        return(
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }
    
        return (
            <Layout>
                {
                    data?.post?.text
                }
            </Layout>
        );
}
export default withUrqlClient(createUrqlClient,{ssr: true})(Post);
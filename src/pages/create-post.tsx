import React, { ReactNode } from 'react'

import { Box, Button } from '@chakra-ui/react';
import { Formik, FormikProps, Form } from 'formik';


import { InputField } from '../components/InputField';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useCreatePostMutation } from '../generated/graphql.tsx/graphql';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/userIsAuth';



const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
   
    const [,createPost] = useCreatePostMutation();
 useIsAuth();
        return (
            <Layout variant='regular'>

            <Formik initialValues = {{title:"",text:""}} onSubmit={ async (values)=> {
              await createPost({input: values})
               router.push('/')
                }
            }>
                {
                    ({ isSubmitting }: FormikProps<{ title: string; text: string; }>): ReactNode=>
                    ( <Form>
        
                           <InputField name='title' placeholder='title' label='Title'/>
                           <Box mt={4}>
        
                           <InputField name='text' placeholder='text...' label='Body' textarea
                           />
                           </Box>
                           <Button type='submit' colorScheme='teal' mt={4} isLoading={isSubmitting}>Create Post</Button>
                        </Form>
                        )
                    }
            </Formik>
                    </Layout>
        );
}
export default withUrqlClient(createUrqlClient) (CreatePost);



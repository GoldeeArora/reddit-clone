import React, { ReactNode } from 'react'
import {Formik,Form, FormikProps} from "formik"
import {  Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useLoginMutation} from '../generated/graphql.tsx/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'


const Login:React.FC<{}> = ({})=> {
  const [,login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant='regular'>

    <Formik initialValues = {{usernameOrEmail:"",password:""}} onSubmit={ async (values,{setErrors})=> {
      console.log(values)
        const response = await login(values );
        if(response.data?.login.errors)
        {
          setErrors(
            toErrorMap(response.data.login.errors)
          )
        }
        else if(response.data?.login.user)
        {
          if(typeof router.query.next ==="string")
          router.push(router.query.next);
          else
          router.push("/")
        }
    }}>
        {
            ({ isSubmitting }: FormikProps<{ usernameOrEmail: string; password: string; }>): ReactNode=>
            ( <Form>

                   <InputField name='usernameOrEmail' placeholder='username or email' label='Username Or Email'/>
                   <Box mt={4}>

                   <InputField name='password' placeholder='password' label='Password'
                   type='password'/>
                   </Box>
                   <Button type='submit' colorScheme='teal' mt={4} isLoading={isSubmitting}> login</Button>
                </Form>
                )
            }
    </Formik>
            </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient) (Login);
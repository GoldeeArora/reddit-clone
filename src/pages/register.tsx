import React, { ReactNode } from 'react'
import {Formik,Form, FormikProps} from "formik"
import {  Box, Button } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql.tsx/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
interface registerProps{

}

const Register:React.FC<registerProps> = ({})=> {
  const [,register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper variant='regular'>

    <Formik initialValues = {{username:"",
    email:"",
    password:""}} onSubmit={ async (values,{setErrors})=> {
        const response = await register({options: values});
        console.log(response)
        if(response.data?.register.errors)
        {
          setErrors(
            toErrorMap(response.data.register.errors)
          )
        }
        else if(response.data?.register.user)
        {
          //worked
          router.push("/")
        }
    }}>
        {
            ({ isSubmitting }: FormikProps<{ username: string; password: string; email:string;}>): ReactNode=>
            ( <Form>

                   <InputField name='username' placeholder='username' label='Username'/>
                   <Box mt={4}>
                   <InputField name='email' placeholder='email' label='Email'/>
                  </Box> 

                   <Box mt={4}>
                   <InputField name='password' placeholder='password' label='Password'
                   type='password'/>
                   </Box>
                   <Button type='submit' colorScheme='teal' mt={4} isLoading={isSubmitting}> register</Button>
                </Form>
                )
            }
    </Formik>
            </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient) (Register)
import { Box,Link,Flex, Button } from '@chakra-ui/react';
// import Link from 'next/link';
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql.tsx/graphql';
import { isServer } from '../utils/isServer';
interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{data,fetching}] = useMeQuery(
        {
            pause: isServer()
        }
    );
    console.log(data)
    const[{fetching: logoutFetching},logout] = useLogoutMutation();
const handleLogout = async ()=>{
    try{

        await logout({});
    }
    catch(err){
        console.log(err)
    }
}
    let body = null;
    if(fetching)
    {
        // user not logged in
    }
    else if(!data?.me) {
        body = (
            <>
                    <NextLink href='/login'>
            
            <Link  mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
            <Link>register</Link>
            </NextLink>
            </>
        )
    }
    else{
       
        body = (
            <Flex>
            <Box mr={2}>{data.me?.username  }</Box>
            <Button onClick={()=>{
               handleLogout()
            }} isLoading={logoutFetching} variant="link" pb={3}>Logout</Button>
            </Flex>
        )
    }
        return (
            <Flex bg ='tan' position="sticky" top={0}>
    <Flex ml={"auto"} h={50} justifyContent="center" pt={3} mr={2}>
{body}
            </Flex>
            </Flex>
        );
}
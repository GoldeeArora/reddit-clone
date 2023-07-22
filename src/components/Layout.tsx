import React, { ReactNode } from 'react'
import { Wrapper } from './Wrapper';
import { Navbar } from './Navbar';
import {Box} from "@chakra-ui/react"
interface LayoutProps {
variant?: "small" | "regular"
children: ReactNode

}

export const Layout: React.FC<LayoutProps> = ({children,variant}) => {
        return (
<Box w="100%">
                <Navbar />
            <Wrapper variant= {variant}>
{children}
            </Wrapper>
 </Box>
        );
}
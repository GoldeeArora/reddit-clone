import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react'

interface WrapperProps {
    children: ReactNode,
variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({children,variant='regular'}) => {
        return (
            <Box maxW={variant==='regular'? "800px":"400px"} w="100%" mt={8} ml="25%">{children}</Box>
        );
}
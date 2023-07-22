import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql.tsx/graphql";
import { useEffect } from "react";
export const useIsAuth = ()=>{

    const router = useRouter();
    const [{data,fetching}] = useMeQuery();
    
    useEffect(() => {
        
        if(!fetching && !data?.me)
        router.replace("/login?next=" + router.pathname)
        
    }, [fetching,data,router])
    
}
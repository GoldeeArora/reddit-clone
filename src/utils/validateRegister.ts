import { UsernamePasswordInput } from "./UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput)=>{
    if(options.username.length<=2)
        {
            return [
                    {
                        field: "username",
                        message: "length of username must be greater than 2"

                    }
                ]
            
        }
        if(options.username.includes("@"))
        {
            return  [
                    {
                        field: "username",
                        message: "cannot include @ sign in username"

                    }
                ]
            
        }
        if(!options.email.includes("@"))
        {
            return  [
                    {
                        field: "email",
                        message: " Invalid email"

                    }
                ]
            
        }
        if(options.password.length<=2)
        {
            return [
                    {
                        field: "password",
                        message: "length of password must be greater than 2"

                    }
            ]
            
        }
        return null;

}
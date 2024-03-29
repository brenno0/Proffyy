import {  Button, Flex, Spinner, Stack } from "@chakra-ui/react"
import { Formik, FormikValues } from "formik"
import { initialValues, validationSchema } from "./utils"
import { CustomInput } from "../../components/Form/CustomInput"
import { useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaUserAlt } from 'react-icons/fa'
import { authApi } from "../../api/auth"
import { useStoreActions } from "../../store"
import { useHistory } from "react-router-dom"
import  Download from '../../common/assets/download.jpg'
import { AxiosResponse } from "axios"
import { Api } from "../../api"

interface User {
    accessToken: string;
    email:string;
    id: number | null; 
    roles: string[];
    username: string;
}


export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formButtonLoading, setFormButtonLoading] = useState(false);
    const setUser = useStoreActions(state => state.addUser)
    const history = useHistory();
    
    
    const setUserInfo = (res:AxiosResponse<any, any>) => {
        const user: User = {
            id:res.data.id,
            username:res.data.username,
            accessToken:res.data.accessToken,
            roles:res.data.roles,
            email:res.data.email
        }
        Api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
        localStorage.setItem('accessToken', res.data.accessToken)
        setUser(user)
    }
    
    const onSubmit = (values: FormikValues) => {
      
        setFormButtonLoading(true)
        authApi.post({...values})
        .then((res:any) => {
            if(res.data){
                 setUserInfo(res)
                    let accessToken = localStorage.getItem('accessToken')
                   
                    if(accessToken){
                        return history.push("/aprovar-reprovar")
                    }
            }
        }).catch((err:Error) => {
            console.error(err)
        }).finally(() => {
            setFormButtonLoading(false)
           
        })
    }
    
    
    return (
        <Flex 
        w="100vw"
        h="100vh" 
        align="center" 
        justify="center"
        backgroundImage={Download}
        backgroundSize="100% 100%"
      >

            <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            style={{backgroundColor:"blue"}}
            onSubmit={onSubmit}
            >
            {({ handleSubmit, isValid, dirty }) => (

                <form onSubmit={handleSubmit}>

                    <Flex 
                    width="100%" 
                    maxWidth={360}
                    bg="gray.800"
                    p="8"
                    borderRadius={8}
                    flexDir="column"
                    >
                    <Stack spacing="4">
                    
                        <CustomInput name="username" label="Nome de usuário*" data-testid="username" hasRightIcon={true} icon={<FaUserAlt fontSize="14px"  style={{marginLeft:"28px"}} color="blackAlpha.700" />}  />
                        
                                                    
                        <CustomInput name="password" label="Senha*" data-testid="password" type={!showPassword ? "password" : "text"} hasRightIconButton={true} onIconButtonClick={() => setShowPassword(!showPassword) } icon={!showPassword ? <AiFillEye color="#4FD1C5" fontSize="22px" /> : <AiFillEyeInvisible color="#4FD1C5" fontSize="24px" /> }  />

            
                    </Stack>
                    
                    <Flex mt={12} justifyContent="center">
                        <Button
                        type="submit"
                        w="30%"
                        disabled={!dirty || !isValid || formButtonLoading}
                        height="50px"
                        color="white" 
                        bg="#4FD1C5"
                        _hover={{ bg: "#4FD1C5"}}
                        >
                        {!formButtonLoading ? "Enviar" :  <Spinner color="#d7d7d7" />}
                        </Button>
                    </Flex>
                    </Flex>
                </form>
            )}  

            </Formik>
        </Flex>
    )
}
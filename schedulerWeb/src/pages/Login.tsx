import React, {useEffect, useState} from 'react'
import {Formik, Form} from 'Formik';
import { Box, Button, Center, createStandaloneToast, FormControl, FormLabel,Input, InputGroup, InputRightElement, toast, useToast } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRouter } from "next/router";
import { API_CONFIG } from '../constants/constants'
import axios from 'axios';
import { useMutation } from 'urql';
import { useCreateInstitutionMutation,useLoginMutation } from '../generated/graphql';
import {toErrorMap } from "../utils/toErrorMap";
interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const toast = createStandaloneToast()
    const [, create] = useCreateInstitutionMutation();
    const [, performLogin] = useLoginMutation();
    useEffect(() => {
        // On Mount only runs once
    }, []);

    return (
        <Wrapper variant='small'>
            <Center h="50px" color="black">
                <FormLabel>Login</FormLabel>
            </Center>
            <Formik 
                initialValues={{username: '', password: ''}} 
                onSubmit={async(values,{setErrors}) => {
                    const resp = await performLogin(values);
                    console.log(resp)
                    if (resp.data?.login.errors) {
                        setErrors(toErrorMap(resp.data.login.errors))
                    } else {
                        toast({
                            title: "Login Successful",
                            description: "You were logged in successfully.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        })
                        router.push('/register')// need to change to home
                    }
                    return resp;
                }}
            > 
                {( props) => (
                    <Box borderWidth="1px" borderRadius="lg" p="10" bg="#F7FAFC">
                        <Form>
                        <InputField 
                            name='username' 
                            label='Username'
                            placeholder='Username'
                        />
                        <Box mt={4}>
                            <InputField 
                                name='password' 
                                label='Password'
                                type='password'
                                placeholder='Password'
                            />
                            {/* <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type={show ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup> */}
                        </Box>
                        <Button  
                            mt={4}
                            w='100%'
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                            >
                            Login
                        </Button>
                        </Form>
                    </Box>
                    
                )}
            </Formik>
        </Wrapper>
    );
}

export default Login;
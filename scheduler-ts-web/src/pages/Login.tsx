import React, {useEffect, useState} from 'react'
import {Formik, Form} from 'Formik';
import { Box, Button, Center, createStandaloneToast, FormControl, FormLabel,Input, InputGroup, InputRightElement, toast, useToast } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRouter } from "next/router";
import { API_CONFIG } from '../constants/constants'
import axios from 'axios';

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const toast = createStandaloneToast()

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
                onSubmit={(values,actions) => {
                    console.log(values)
                    axios({
                        method: 'post',
                        url: `${API_CONFIG.API_URL}/Login`,
                        headers: {}, 
                        data: {
                            username: encodeURI(values.username),
                            password: encodeURI(values.password)
                        }
                      }).then((response) => {
                        // need to add logic if the login was successful
                        const {data: {success}} = response;
                        if (success) {
                            // Correct Login Redirect To Home
                            toast({
                                title: "Login Successful",
                                description: "You were logged in successfully.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            })
                        } else {
                            // Incorrect Login
                            toast({
                                title: "Login Failed",
                                description: "Incorrect Information.",
                                status: "warning",
                                duration: 3000,
                                isClosable: true,
                            })
                        }
                        // Disable the Login Button
                        actions.setSubmitting(false)
                    }).catch(err => {
                        console.warn(err)
                        actions.setSubmitting(false)
                        toast({
                            title: "Hmm. Something went wrong.",
                            description: "An error occurred, the login could not be completed.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        })
                    });
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
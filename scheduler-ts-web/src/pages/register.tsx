import React from 'react'
import {Formik, Form} from 'Formik';
import { Box, Button, Center, FormControl, FormLabel,Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';

interface registerProps {

}
const Register: React.FC<registerProps> = ({}) => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    const testFunction = () => console.log('test');
    return (
        <Wrapper variant='small'>
            <Center h="50px" color="black">
                <FormLabel>Register</FormLabel>
            </Center>
            <Formik 
                initialValues={{username: '', password: ''}} 
                onSubmit={(values) => {
                    setTimeout( () => {
                        return null;
                    }, 3000)
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
                            {/* <InputField 
                                name='password' 
                                label='Password'
                                type='password'
                            /> */}
                            <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type={show ? "text" : "password"}
                                    placeholder="Enter password"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
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

export default Register
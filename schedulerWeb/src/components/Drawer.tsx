import { Button, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from '@chakra-ui/react'
import React, { MutableRefObject } from 'react'

interface DrawerProps {
    isOpen: boolean,
    placement: String,
    onClose: () => void,
    finalFocusRef: MutableRefObject<undefined>
}

const Drawer: React.FC<DrawerProps> = ({...props}) =>	 {
      
    return (
        <>
        <Drawer
            {...props}
        >
            <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>
    
                <DrawerBody>
                <Input placeholder="Type here..." />
                </DrawerBody>
    
                <DrawerFooter>
                <Button variant="outline" mr={3} onClick={props.onClose}>
                    Cancel
                </Button>
                <Button color="blue">Save</Button>
                </DrawerFooter>
            </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        </>
    )
}

export default Drawer;
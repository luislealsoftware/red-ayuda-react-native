import React from 'react'
import { Button, Div, Icon, Text } from 'react-native-magnus';

const HelpPage = () => {
    return (
        <Div p={50} alignItems='center' justifyContent='center'>
            <Button
                bg="red500"
                h={200}
                w={200}
                mx="xl"
                rounded="circle"
                shadow="md"
                borderless
            >
                <Icon name="alert-triangle" color="white" fontFamily="Feather" fontSize={50} />
            </Button>
            <Text fontSize="2xl" mt="xl" textAlign="center">
                <Icon name='infocirlceo' fontSize="2xl" />
                Al presionar el botón se enviará una alerta a toda tu red.
            </Text>
        </Div>
    )
}

export default HelpPage;
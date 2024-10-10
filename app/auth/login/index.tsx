import { Link } from 'expo-router';
import React from 'react';
import { Button, Div, Icon, Input, Text } from 'react-native-magnus';


const LoginScreen = () => {
    return (
        <Div m="3xl" alignItems='center'>
            <Text fontSize="6xl">Iniciar sesión</Text>
            <Input
                mt="md"
                placeholder="Correo electrónico"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
            />

            <Input
                placeholder="Contraseña"
                mt="md"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />

            <Div>
                <Button block mt="md" bg="blue700" color="white">
                    Iniciar sesión</Button>
            </Div>

            <Link href="/auth/register" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Todavía no tienes una cuenta? Regístrate</Text>
            </Link>

        </Div>
    )
}

export default LoginScreen;
import { Link } from 'expo-router';
import React from 'react';
import { Button, Div, Icon, Input, Text } from 'react-native-magnus';


const RegisterScreen = () => {
    return (
        <Div m="3xl" alignItems='center'>
            <Text fontSize="6xl">Registro</Text>
            <Input
                mt="md"
                placeholder="Usuario"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="user" color="gray900" fontFamily="Feather" />}
            />

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

            <Input
                placeholder="Repetir contraseña"
                mt="md"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}

            />

            <Div>
                <Button block mt="md" bg="blue700" color="white">
                    Registrarme</Button>
            </Div>

            <Link href="/auth/login" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Ya tienes cuenta? Inicia sesión</Text>
            </Link>

        </Div>
    )
}

export default RegisterScreen;
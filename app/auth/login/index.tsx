import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Div, Icon, Input, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase';
import { Alert } from 'react-native';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
        if (!error) router.push('/app');
    }

    return (
        <Div m="3xl" alignItems='center'>
            <Text fontSize="6xl">Iniciar sesión</Text>
            <Input
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}
                value={email}
                mt="md"
                placeholder="Correo electrónico"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
            />

            <Input
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Contraseña"
                mt="md"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />

            <Div>
                <Button
                    block
                    mt="md"
                    bg="blue700"
                    color="white"
                    disabled={loading}
                    onPress={() => signInWithEmail()}>
                    Iniciar sesión</Button>
            </Div>

            <Link href="/auth/register" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Todavía no tienes una cuenta? Regístrate</Text>
            </Link>

        </Div>
    )
}

export default LoginScreen;
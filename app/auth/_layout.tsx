import { Slot, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [sessionChecked, setSessionChecked] = useState(false); // Estado para saber si ya se verificó la sesión

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                router.replace('/app'); // Redirigir si ya hay una sesión activa
            } else {
                setSessionChecked(true); // Permitir mostrar el contenido de autenticación si no hay sesión
            }
            setLoading(false); // Detener el loader
        };

        checkSession();
    }, [router]);

    // Mostrar el loader mientras se verifica la sesión
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Una vez que se haya verificado la sesión, renderiza las pantallas de autenticación si no hay sesión activa
    return sessionChecked ? <Slot /> : null;
}
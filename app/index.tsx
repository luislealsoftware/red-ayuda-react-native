import { Session } from '@supabase/supabase-js';
import { Redirect, Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../lib/supabase';

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);

  const registerPushToken = async (session: Session | null) => {
    if (!session?.user) {
        console.warn('No se puede registrar el push token: usuario no autenticado.');
        return;
    }

    try {
        if (!Device.isDevice) {
            console.warn('Las notificaciones push solo son compatibles con dispositivos físicos.');
            return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Permiso de notificaciones no concedido.');
            return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const pushToken = tokenData.data;

        const { error } = await supabase
            .from('users')
            .update({ push_token: pushToken })
            .eq('auth_user_id', session.user.id);

        if (error) {
            console.error('Error al guardar el push token en Supabase:', error.message);
        } else {
            console.log('Push token registrado con éxito:', pushToken);
        }
    } catch (error) {
        console.error('Error al registrar el push token:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // Registrar el push token si hay una sesión activa
        if (session) {
            await registerPushToken(session);
        }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);

        // Registrar el push token si hay una nueva sesión activa
        if (session) {
            registerPushToken(session);
        }
    });

    return () => {
        authListener?.subscription.unsubscribe();
    };
  }, []);

  // Si no hay sesión, redirigir al login
  if (session === null) {
    return <Redirect href="/auth/login" />;
  }

  // Si hay sesión, renderiza el contenido principal
  return <Slot />;
};

export default HomePage;

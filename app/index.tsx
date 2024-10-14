import { Session } from '@supabase/supabase-js';
import { Redirect, Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const HomePage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Se asegura que cuando el componente se desmonte, la suscripción se cancele correctamente
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
}

export default HomePage;
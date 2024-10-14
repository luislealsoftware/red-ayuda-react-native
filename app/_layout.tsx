import { router, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-magnus';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function HomeLayout() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, []);

    return (
        <ThemeProvider>
            <SafeAreaView>
                <Slot />
            </SafeAreaView>
        </ThemeProvider>
    );
};
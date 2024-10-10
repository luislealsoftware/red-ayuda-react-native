import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-magnus';

export default function HomeLayout() {

    return (
        <ThemeProvider>
            <SafeAreaView>
                <Slot />
            </SafeAreaView>
        </ThemeProvider>
    );
};
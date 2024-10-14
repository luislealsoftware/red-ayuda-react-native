import { Link, Slot } from 'expo-router';
import { Div } from 'react-native-magnus';
export default function AppLayout() {

    return (
        <Div>
            <Slot />
            <Div>
                <Link href="/app/help">Help</Link>
                <Link href="/app">Home</Link>
                <Link href="/app/find">Find</Link>
            </Div>
        </Div>
    );
};
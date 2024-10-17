import { Link, Slot, usePathname } from 'expo-router';
import { Div, Icon } from 'react-native-magnus';

export default function AppLayout() {
    const pathname = usePathname(); // Obtener la ruta actual

    return (
        <Div flex={1}>
            <Slot />
            <Div
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="white"
                borderTopWidth={1}
                borderColor="gray200"
                flexDir='row'
                justifyContent="space-around"
                alignItems="center"
                p="lg"
            >
                <Link href="/app/help" style={{ alignItems: 'center' }}>
                    <Div 
                        bg={pathname === '/app/help' ? 'lightblue' : 'transparent'} // Cambia el fondo si la ruta es /app/help
                        p="md"
                        rounded="lg"
                    >
                        <Icon name="exclamationcircleo" fontSize={24} />
                    </Div>
                </Link>
                <Link href="/app" style={{ alignItems: 'center' }}>
                    <Div 
                        bg={pathname === '/app' ? 'lightgreen' : 'transparent'} // Cambia el fondo si la ruta es /app
                        p="md"
                        rounded="lg"
                    >
                        <Icon name="home" fontSize={24} />
                    </Div>
                </Link>
                <Link href="/app/find" style={{ alignItems: 'center' }}>
                    <Div 
                        bg={pathname === '/app/find' ? 'lightyellow' : 'transparent'} // Cambia el fondo si la ruta es /app/find
                        p="md"
                        rounded="lg"
                    >
                        <Icon name="find" fontSize={24} />
                    </Div>
                </Link>
            </Div>
        </Div>
    );
}
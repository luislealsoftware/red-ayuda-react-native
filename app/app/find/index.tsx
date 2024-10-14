import React from 'react'
import { Alert, FlatList } from 'react-native';
import { Badge, Button, Div, Fab, Header, Host, Icon, Image, Input, Portal, Text } from 'react-native-magnus';
import Constants from "expo-constants";
import { supabase } from '../../../lib/supabase';

const friends = [
    {
        id: 1,
        image:
            'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    },
    {
        id: 2,
        image:
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1927&q=80',
    },
    {
        id: 3,
        image:
            'https://images.unsplash.com/photo-1516640997890-5e4c83df8419?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    },
    {
        id: 4,
        image:
            'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1952&q=80',
    },
    {
        id: 5,
        image:
            'https://images.unsplash.com/photo-1453365607868-7deed8cc7d26?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    },
    {
        id: 6,
        image:
            'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    },
];

const FindPage = () => {

    return (
        <>
            <Header
                shadow={0}
                suffix={
                    <Div row alignItems="center">
                        <Badge
                            bg="green500"
                            zIndex={10}
                            right={-5}
                            top={0}
                            h={12}
                            w={12}>
                            <Button
                                bg="gray200"
                                p="none"
                                rounded="circle"
                                onPress={() => { }}>
                                <Image
                                    h={40}
                                    w={40}
                                    source={{
                                        uri:
                                            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80',
                                    }}
                                />
                            </Button>
                        </Badge>

                        {/* Botón para cerrar sesión */}
                        <Button
                            bg="red500"
                            ml="lg"
                            onPress={async () => {
                                await supabase.auth.signOut();  // Cierra la sesión
                                Alert.alert('Sesión cerrada'); // Opcional: alerta de confirmación
                            }}>
                            <Text color="white">Cerrar sesión</Text>
                        </Button>
                    </Div>
                }>
                <Div>
                    <Text fontWeight="bold" fontSize="5xl">
                        Explorar
                    </Text>
                    <Text color="gray700" fontSize="xl" mt="md" mb="sm">
                        Mi red
                    </Text>
                </Div>
            </Header>
            <Input placeholder="Buscar amigos" mt={10} mb={10} mx="md" suffix={<Icon name='mail' />} />
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Div m="md">
                        <Image
                            h={200}
                            w={200}
                            rounded="xl"
                            source={{ uri: item.image }}
                        />
                    </Div>
                )} />
        </>
    )
}

export default FindPage;
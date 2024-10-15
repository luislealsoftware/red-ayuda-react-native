import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Badge, Button, Div, Header, Image, Input, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase';

// Definimos la interfaz para los usuarios
type User = {
    id: string;
    name: string;
    country: string;
};

// Definimos la interfaz para los amigos (si la estructura es diferente, podrías ajustarla)
interface Friend {
    id: string;
    name: string;
    image: string;
}

const FindPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // Tipado explícito para el query
    const [searchResults, setSearchResults] = useState<User[]>([]); // Lista de usuarios que devuelve la búsqueda
    const [friendsList, setFriendsList] = useState<Friend[]>([]); // Lista de amigos

    // Función para buscar usuarios
    const searchUsers = async (query: string) => {
        console.log('Query final:', `%${query}%`);

        const { data, error } = await supabase
            .from('users')
            .select('id, name, country')
            .ilike('name', `%${query}%`);

        if (error) {
            console.error('Error al buscar usuarios:', error.message);
            return;
        }

        if (data) {
            setSearchResults(data);
        }
    };

    // Función para agregar un amigo a la red
    const addFriend = async (friendId: string) => {
        const { data: { user } } = await supabase.auth.getUser(); // Obtén el ID del usuario actual
        const userId = user?.id;

        const { error } = await supabase
            .from('friends')
            .insert([
                { user_id: userId, friend_id: friendId }
            ]);

        if (error) {
            console.error('Error al agregar amigo:', error.message);
        } else {
            Alert.alert('Amigo agregado con éxito');
        }
    };

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

            {/* Input para buscar amigos */}
            <Input
                placeholder="Buscar por nombre"
                mt={10}
                mb={10}
                mx="md"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)} // Actualiza el estado del query
                onSubmitEditing={(e) => searchUsers(e.nativeEvent.text)} // Ejecuta la búsqueda cuando el usuario presiona "Enter"
            />

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
                <>
                    <Text mx="md" fontWeight="bold" mb="lg">Resultados de búsqueda</Text>
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <Div m="md" row alignItems="center">
                                <Text ml="md">{item.name || item.country}</Text>
                                <Button
                                    bg="blue500"
                                    ml="auto"
                                    onPress={() => addFriend(item.id)}>
                                    <Text color="white">Agregar</Text>
                                </Button>
                            </Div>
                        )}
                    />
                </>
            )}

            {/* Lista de amigos ya agregados */}
            <FlatList
                data={friendsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Div m="md">
                        <Image
                            h={200}
                            w={200}
                            rounded="xl"
                            source={{ uri: item.image }}
                        />
                        {/* Si deseas agregar un texto descriptivo aquí, asegúrate de envolverlo en un componente <Text> */}
                        <Text>{item.name}</Text> {/* Asegúrate de que item.name esté envuelto en <Text> */}
                    </Div>
                )}
            />
        </>
    );
};

export default FindPage;
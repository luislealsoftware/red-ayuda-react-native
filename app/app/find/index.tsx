import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Badge, Button, Div, Header, Image, Input, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'expo-router';

// Definimos la interfaz para los usuarios
type User = {
    auth_user_id: string;
    name: string;
    country: string;
    image: string;
};

const FindPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>(''); // Tipado explícito para el query
    const [searchResults, setSearchResults] = useState<User[]>([]); // Lista de usuarios que devuelve la búsqueda
    const [friendsList, setFriendsList] = useState<User[]>([]); // Lista de amigos

    const router = useRouter(); // Importa el hook de enrutamiento

    useEffect(() => {
        fetchFriends(); // Llama a la función para obtener amigos al cargar el componente
    }, []);

    // Función para buscar usuarios
    const searchUsers = async (query: string) => {

        const { data, error } = await supabase
            .from('users')
            .select('auth_user_id, name, country, image')
            .ilike('name', `%${query}%`);

        if (error) {
            console.error('Error al buscar usuarios:', error.message);
            return;
        }

        if (data) {
            setSearchResults(data);
        }
    };

    // Función para obtener la lista de amigos
    const fetchFriends = async () => {
        const { data: { user } } = await supabase.auth.getUser(); // Obtén el ID del usuario actual
        const userId = user?.id;

        const { data, error } = await supabase
            .from('friends')
            .select('friend_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error al cargar amigos:', error.message);
            return;
        }

        if (data) {
            const friendIds = data.map(friend => friend.friend_id);
            const { data: friendsData, error: fetchError } = await supabase
                .from('users')
                .select('auth_user_id, name, image, country') // Asegúrate de que 'image' esté en la tabla de usuarios
                .in('auth_user_id', friendIds);

            if (fetchError) {
                console.error('Error al cargar usuarios amigos:', fetchError.message);
            } else {
                setFriendsList(friendsData);
            }
        }
    };

    // Función para agregar un amigo a la red
    const addFriend = async (friendId: string) => {
        const { data: { user } } = await supabase.auth.getUser(); // Obtén el ID del usuario actual
        const userId = user?.id;

        const { data: currentIdData, error: userError } = await supabase
            .from('users')
            .select('auth_user_id')
            .eq('auth_user_id', userId)
            .single(); // Obtiene un solo registro

        if (userError) {
            console.error('Error al obtener el ID del usuario:', userError.message);
            return; // Maneja el error apropiadamente
        }

        const currentId = currentIdData?.auth_user_id;

        const { error } = await supabase
            .from('friends')
            .insert([{ user_id: currentId, friend_id: friendId }]);

        if (error) {
            console.error('Error al agregar amigo:', error.message);
        } else {
            Alert.alert('Amigo agregado con éxito');

            // En lugar de solo agregar el amigo manualmente, volvemos a cargar toda la lista de amigos
            fetchFriends(); // Recarga la lista de amigos desde la base de datos
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
                                router.push('/auth/login'); // Redirige al usuario a la página de inicio de sesión
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
                        keyExtractor={(item) => item.auth_user_id}
                        renderItem={({ item }) => (
                            <Div m="md" row alignItems="center">
                                <Text ml="md">{item.name || item.country}</Text>
                                <Button
                                    bg={friendsList.some(friend => friend.auth_user_id === item.auth_user_id) ? "gray500" : "blue500"}
                                    ml="auto"
                                    onPress={() => {
                                        if (!friendsList.some(friend => friend.auth_user_id === item.auth_user_id)) {
                                            addFriend(item.auth_user_id);
                                        }
                                    }}
                                    disabled={friendsList.some(friend => friend.auth_user_id === item.auth_user_id)}
                                >
                                    <Text color="white">{friendsList.some(friend => friend.auth_user_id === item.auth_user_id) ? 'Ya agregado' : 'Agregar'}</Text>
                                </Button>
                            </Div>
                        )}
                    />
                </>
            )}

            {/* Lista de amigos ya agregados */}
            {friendsList.length > 0 && (
                <FlatList
                    data={friendsList}
                    keyExtractor={(item) => item.auth_user_id}
                    renderItem={({ item }) => (
                        <Div m="md">
                            <Image
                                h={200}
                                w={200}
                                rounded="xl"
                                source={{ uri: 'https://via.placeholder.com/200' }}
                            />
                            <Text>{item.name}</Text>
                        </Div>
                    )}
                />
            )}
        </>
    );
};

export default FindPage;
import React, { useEffect, useState } from 'react';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase';
import * as Location from 'expo-location';
import { Alert, FlatList } from 'react-native';

const HelpPage: React.FC = () => {
    interface LocationType {
        latitude: number;
        longitude: number;
    }

    interface EmergencyRequest {
        user_id: string;
        latitude: number;
        longitude: number;
        username: string;
    }

    const [location, setLocation] = useState<LocationType | null>(null);
    const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Error', 'Permiso de ubicación denegado.');
                return;
            }

            const userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
            });
        } catch (error) {
            console.error('Error obteniendo la ubicación:', error);
            Alert.alert('Error', 'No se pudo obtener la ubicación.');
        }
    };

    const fetchEmergencyRequests = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            const { data: friendsData, error: friendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userId);

            if (friendsError) {
                console.error('Error obteniendo amigos:', friendsError.message);
                return;
            }

            const friendIds = friendsData.map(friend => friend.friend_id);

            const { data: requestsData, error: requestError } = await supabase
                .from('emergency_requests')
                .select('user_id, latitude, longitude')
                .in('user_id', friendIds);

            if (requestError) {
                console.error('Error obteniendo solicitudes de emergencia:', requestError.message);
                return;
            }

            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('auth_user_id, name')
                .in('auth_user_id', friendIds);

            if (usersError) {
                console.error('Error obteniendo nombres de usuarios:', usersError.message);
                return;
            }

            const emergencyRequestsWithNames = requestsData.map(request => {
                const user = usersData.find(user => user.auth_user_id === request.user_id);
                return {
                    ...request,
                    username: user ? user.name : 'Desconocido',
                };
            });

            setEmergencyRequests(emergencyRequestsWithNames);
        } catch (err) {
            console.error('Error al intentar obtener solicitudes:', err);
        }
    };

    const sendEmergencyRequest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            if (!location) {
                Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
                return;
            }

            const { error: insertError } = await supabase
                .from('emergency_requests')
                .insert([{ user_id: userId, latitude: location.latitude, longitude: location.longitude }]);

            if (insertError) {
                console.error('Error al enviar la solicitud de emergencia:', insertError.message);
                Alert.alert('Error', 'Hubo un problema al enviar la solicitud de emergencia.');
                return;
            }

            await fetchEmergencyRequests();

            Alert.alert('Alerta enviada', 'Tu solicitud de ayuda ha sido enviada a tus amigos.');
        } catch (err) {
            console.error('Error al intentar enviar solicitud:', err);
        }
    };

    useEffect(() => {
        getLocation();
        fetchEmergencyRequests();
    }, []);

    return (
        <Div p={50} alignItems='center' justifyContent='center'>
            <Button
                bg="red500"
                h={200}
                w={200}
                mx="xl"
                rounded="circle"
                shadow="md"
                borderless
                onPress={sendEmergencyRequest}
            >
                <Icon name="alert-triangle" color="white" fontFamily="Feather" fontSize={50} />
            </Button>
            <Text fontSize="2xl" mt="xl" textAlign="center">
                <Icon name='info' fontSize="2xl" /> {/* Cambié 'infocircleo' a 'info' */}
                Al presionar el botón se enviará una alerta a toda tu red.
            </Text>
            
            <FlatList
                data={emergencyRequests}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => (
                    <Div mt="md" p="lg" bg="gray200">
                        <Text>Nombre: {item.username}</Text>
                        <Text>Latitude: {item.latitude}</Text>
                        <Text>Longitude: {item.longitude}</Text>
                    </Div>
                )}
                ListHeaderComponent={() => (
                    <Text fontSize="lg" fontWeight="bold" mb="md">
                        Solicitudes de Emergencia de Amigos
                    </Text>
                )}
            />
        </Div>
    );
};

export default HelpPage;

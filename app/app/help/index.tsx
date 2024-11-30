import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import * as Location from 'expo-location';
import { supabase } from '../../../lib/supabase';
import * as Notifications from 'expo-notifications';

const HelpPage = () => {
    interface LocationType {
        latitude: number;
        longitude: number;
    }

    const [location, setLocation] = useState<LocationType | null>(null);

    // Función para obtener la ubicación actual
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

    // Obtener ubicación al cargar el componente
    useEffect(() => {
        getLocation();
    }, []);

    // Función para enviar la solicitud de emergencia y notificaciones
    const sendEmergencyRequest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            if (!userId || !location) {
                Alert.alert('Error', 'No se pudo procesar tu solicitud.');
                return;
            }

            // Insertar la solicitud de emergencia en la base de datos
            const { data: emergencyRequest, error: insertError } = await supabase
                .from('emergency_requests')
                .insert([{
                    user_id: userId,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    status: 'pending',
                }])
                .select()
                .single();

            if (insertError || !emergencyRequest) {
                console.error('Error al insertar la solicitud:', insertError?.message);
                Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
                return;
            }

            // Obtener la lista de amigos y sus tokens
            const { data: friends, error: friendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userId);

            if (friendsError || !friends) {
                console.error('Error al obtener amigos:', friendsError?.message);
                Alert.alert('Error', 'No se pudo notificar a tus amigos.');
                return;
            }

            const friendIds = friends.map(friend => friend.friend_id);

            const { data: friendUsers, error: usersError } = await supabase
                .from('users')
                .select('push_token')
                .in('auth_user_id', friendIds);

            if (usersError || !friendUsers) {
                console.error('Error al obtener los tokens de los amigos:', usersError?.message);
                Alert.alert('Error', 'No se pudo enviar notificaciones.');
                return;
            }

            // Enviar notificaciones a los amigos
            friendUsers.forEach(async friend => {
                if (friend.push_token) {
                    await sendPushNotification(friend.push_token, emergencyRequest.id);
                }
            });

            Alert.alert('Alerta enviada', 'Tu solicitud ha sido enviada a tu red.');
        } catch (error) {
            console.error('Error al procesar la solicitud de emergencia:', error);
            Alert.alert('Error', 'Ocurrió un problema al procesar tu solicitud.');
        }
    };

    // Función para enviar notificaciones push
    const sendPushNotification = async (expoPushToken: string, requestId: number) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Solicitud de Emergencia',
            body: 'Un amigo necesita tu ayuda. Revisa su ubicación.',
            data: { emergencyRequestId: requestId },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    };

    return (
        <Div flex={1} justifyContent="center" alignItems="center">
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
                Al presionar el botón, se enviará una alerta a toda tu red.
            </Text>
        </Div>
    );
};

export default HelpPage;

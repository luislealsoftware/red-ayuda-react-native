import React, { useEffect, useState } from 'react';
import { Button, Div, Icon, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

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

    useEffect(() => {
        getLocation(); // Obtener la ubicación al cargar la página
    }, []);

    const sendEmergencyRequest = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            if (!location) {
                Alert.alert('Error', 'No se pudo obtener tu ubicación. Inténtalo de nuevo.');
                return;
            }

            const { error } = await supabase
                .from('emergency_requests')
                .insert([{ user_id: userId, latitude: location.latitude, longitude: location.longitude }]);

            if (error) {
                console.error('Error al enviar la solicitud de emergencia:', error.message);
                Alert.alert('Error', 'Hubo un problema al enviar la solicitud de emergencia.');
            } else {
                Alert.alert('Alerta enviada', 'Tu solicitud de ayuda ha sido enviada a tu red.');
            }
        } catch (err) {
            console.error('Error al intentar enviar solicitud:', err);
        }
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
                <Icon name='infocirlceo' fontSize="2xl" />
                Al presionar el botón se enviará una alerta a toda tu red.
            </Text>
        </Div>
    );
};

export default HelpPage;
import React, { useEffect, useState } from 'react';
import { Div, Text } from 'react-native-magnus';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';

const AppHome = () => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            // Solicitar permisos de ubicación
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso para acceder a la ubicación denegado');
                return;
            }

            // Obtener la ubicación actual
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
        })();

        // Obtener solicitudes de emergencia
        const fetchEmergencyRequests = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id;

            // Obtener amigos
            const { data: friendsData, error: friendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userId);

            if (friendsError) {
                console.error('Error al obtener amigos:', friendsError.message);
                return;
            }

            const friendIds = friendsData.map(friend => friend.friend_id);

            // Obtener solicitudes de emergencia
            const { data: emergencyData, error: emergencyError } = await supabase
                .from('emergency_requests')
                .select('*')
                .in('user_id', [userId, ...friendIds]);

            if (emergencyError) {
                console.error('Error al obtener solicitudes de emergencia:', emergencyError.message);
                return;
            }

            setEmergencyRequests(emergencyData);
        };

        fetchEmergencyRequests();
    }, []);

    return (
        <Div flex={1}>
            {errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : location ? (
                <MapView
                    style={{ flex: 1 }}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                >
                    {emergencyRequests.map((request, index) => (
                        <React.Fragment key={index}>
                            <Circle
                                center={{
                                    latitude: request.latitude,
                                    longitude: request.longitude,
                                }}
                                radius={30}
                                strokeColor="rgba(255,0,0,0.5)"
                                fillColor="rgba(255,0,0,0.2)"
                            />
                            <Marker
                                coordinate={{
                                    latitude: request.latitude,
                                    longitude: request.longitude,
                                }}
                            >
                                <Callout style={{ padding: 10 }}>
                                    <Text fontWeight="bold" fontSize="lg" color="black">{request.user_id}</Text>
                                    <Text fontSize="md" color="gray">Status: {request.status}</Text>
                                    <Text fontSize="sm" color="gray">Fecha: {new Date(request.created_at).toLocaleString()}</Text>
                                </Callout>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapView>
            ) : (
                <Text>Cargando...</Text>
            )}
        </Div>
    );
};

export default AppHome;
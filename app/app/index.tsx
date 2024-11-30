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
        // Función para obtener solicitudes de emergencia
    const fetchEmergencyRequests = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id;
  
          if (!userId) return;
  
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
            .in('user_id', [userId, ...friendIds]);  // Relacionar con amigos
  
          if (emergencyError) {
            console.error('Error al obtener solicitudes de emergencia:', emergencyError.message);
            setErrorMsg('Error al obtener solicitudes de emergencia');
            return;
          }
  
          // Ahora, por cada solicitud de emergencia, obtenemos el nombre del usuario
          const requestsWithNames = await Promise.all(emergencyData.map(async (request) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name')
              .eq('auth_user_id', request.user_id)
              .single(); // Obtén solo un resultado (un único usuario)
  
            if (userError) {
              console.error('Error al obtener el nombre del usuario:', userError.message);
              return { ...request, user_name: 'Nombre no disponible' };
            }
  
            return { ...request, user_name: userData?.name };
          }));
  
          setEmergencyRequests(requestsWithNames);  // Asigna la lista con los nombres
        } catch (error) {
          console.error("Error al obtener solicitudes de emergencia:", error);
          setErrorMsg('Hubo un error al obtener las solicitudes de emergencia');
        }
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
                                    <Text fontWeight="bold" fontSize="lg" color="black"> {request.user_name || 'Nombre no disponible'}</Text>
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
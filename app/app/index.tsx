import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Div } from 'react-native-magnus';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const AppHome = () => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
                    showsUserLocation={true} // Muestra la ubicación del usuario en el mapa
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Tu ubicación"
                        description="Aquí estás"
                    />
                </MapView>
            ) : (
                <Text>Cargando...</Text>
            )}
        </Div>
    );
};

export default AppHome;
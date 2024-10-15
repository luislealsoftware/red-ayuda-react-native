import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, Div, Icon, Input, Select, SelectRef, Text } from 'react-native-magnus';
import { supabase } from '../../../lib/supabase'; // Asegúrate de tener esta importación para usar supabase
import { Alert } from 'react-native';

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    interface Errors {
        name?: string;
        country?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }

    const [errors, setErrors] = useState<Errors>({});
    const countryRef = React.createRef<SelectRef>();

    const onSelectOption = (value: React.SetStateAction<string>) => {
        setCountry(value);
    };

    const validateForm = () => {
        let valid = true;
        let validationErrors = {
            name: "",
            country: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!name) {
            validationErrors.name = "El nombre completo es obligatorio";
            valid = false;
        }

        if (!country) {
            validationErrors.country = "Debe seleccionar un país";
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            validationErrors.email = "Debe ingresar un correo electrónico válido";
            valid = false;
        }

        if (password.length < 8) {
            validationErrors.password = "La contraseña debe tener al menos 8 caracteres";
            valid = false;
        }

        if (password !== confirmPassword) {
            validationErrors.confirmPassword = "Las contraseñas no coinciden";
            valid = false;
        }

        setErrors(validationErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);

            // Intentamos registrar al usuario en el auth de Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                Alert.alert("Error al registrarse", error.message);
                setLoading(false);
                return;
            }

            // Si el registro fue exitoso, obtenemos el user ID para la relación en la tabla de usuarios
            const userId = data.user?.id;

            if (userId) {
                // Guardamos la información adicional del usuario en la tabla "users"
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            auth_user_id: userId, // Guardamos el ID del auth
                            name: name,
                            country: country,
                        }
                    ]);

                if (insertError) {
                    Alert.alert("Error al guardar información de usuario", insertError.message);
                } else {
                    Alert.alert("Registro exitoso", "Verifica tu correo electrónico para confirmar tu cuenta.");
                }
            }

            setLoading(false);
        }
    };

    const countries: string[] = [
        "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", "República Checa", "República de Macedonia", "República del Congo", "República Democrática del Congo", "República Dominicana", "República Sudafricana", "Ruanda", "Rumanía", "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
    ];

    return (
        <Div m="3xl" alignItems='center'>
            <Text fontSize="6xl">Registro</Text>

            <Input
                mt="md"
                placeholder="Nombre completo"
                p={10}
                focusBorderColor="blue700"
                value={name}
                onChangeText={setName}
                prefix={<Icon name="user" color="gray900" fontFamily="Feather" />}
            />
            {errors.name && <Text color="red500">{errors.name}</Text>}

            <Button
                block
                prefix={<Icon name="flag" color="gray900" fontFamily="Feather" />}
                mt="md"
                borderWidth={1}
                bg="white"
                color="gray900"
                borderColor="gray300"
                onPress={() => countryRef.current?.open()}
            >
                {country.length ? country.toString() : 'Selecciona país de origen'}
            </Button>
            {errors.country && <Text color="red500">{errors.country}</Text>}

            <Select
                onSelect={onSelectOption}
                ref={countryRef}
                value={country}
                title="País de Origen"
                mt="md"
                pb="2xl"
                roundedTop="xl"
                data={countries}
                renderItem={(item) => (
                    <Select.Option value={item} py="md" px="xl">
                        <Text>{item}</Text>
                    </Select.Option>
                )}
            />

            <Input
                mt="md"
                placeholder="Correo electrónico"
                p={10}
                focusBorderColor="blue700"
                value={email}
                onChangeText={setEmail}
                prefix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
            />
            {errors.email && <Text color="red500">{errors.email}</Text>}

            <Input
                mt="md"
                placeholder="Contraseña"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                value={password}
                onChangeText={setPassword}
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />
            {errors.password && <Text color="red500">{errors.password}</Text>}

            <Input
                mt="md"
                placeholder="Repetir contraseña"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />
            {errors.confirmPassword && <Text color="red500">{errors.confirmPassword}</Text>}

            <Div>
                <Button
                    block
                    mt="md"
                    bg="blue700"
                    color="white"
                    disabled={loading}
                    onPress={handleSubmit}
                >
                    {loading ? 'Registrando...' : 'Registrarme'}
                </Button>
            </Div>

            <Link href="/auth/login" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Ya tienes cuenta? Inicia sesión</Text>
            </Link>
        </Div>
    );
}

export default RegisterScreen;
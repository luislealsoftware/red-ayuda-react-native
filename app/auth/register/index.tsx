import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, Div, Icon, Input, Select, SelectRef, Text } from 'react-native-magnus';


const RegisterScreen = () => {

    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    interface Errors {
        name?: string;
        country?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }

    const [errors, setErrors] = useState<Errors>({});
    const countryRef = React.createRef<SelectRef>();

    const onSelectOption = (value: any) => {
        setCountry(value);
    };

    const validateForm = () => {
        let valid = true;
        let validationErrors: any = {};

        // Validar el nombre completo
        if (!name) {
            validationErrors.name = "El nombre completo es obligatorio";
            valid = false;
        }

        // Validar el país
        if (!country) {
            validationErrors.country = "Debe seleccionar un país";
            valid = false;
        }

        // Validar el correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            validationErrors.email = "Debe ingresar un correo electrónico válido";
            valid = false;
        }

        // Validar la contraseña
        if (password.length < 8) {
            validationErrors.password = "La contraseña debe tener al menos 8 caracteres";
            valid = false;
        }

        // Validar la confirmación de la contraseña
        if (password !== confirmPassword) {
            validationErrors.confirmPassword = "Las contraseñas no coinciden";
            valid = false;
        }

        setErrors(validationErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Aquí envías los datos al backend si todo es válido
            console.log({
                name,
                country,
                email,
                password,
            });
        } else {
            console.log("Errores en la validación:", errors);
        }
    };

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina',
        'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
        'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
        'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
        'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
        'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
        'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia',
        'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
        'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
        'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
        'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
        'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
        'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
        'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
        'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
        'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
        'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
        'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
        'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
        'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
        'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
        'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
        'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
        'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
        'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
        'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
        'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
        'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
        'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
        'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
        'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
        'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
        'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
        'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
        'Yemen', 'Zambia', 'Zimbabwe'
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
                onChangeText={(text) => setName(text)}
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
                onPress={() => {
                    if (countryRef.current) {
                        countryRef.current.open();
                    }
                }}>
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
                onChangeText={(text) => setEmail(text)}
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
                onChangeText={(text) => setPassword(text)}
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
                onChangeText={(text) => setConfirmPassword(text)}
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />
            {errors.confirmPassword && <Text color="red500">{errors.confirmPassword}</Text>}

            <Div>
                <Button block mt="md" bg="blue700" color="white" onPress={handleSubmit}>
                    Registrarme
                </Button>
            </Div>

            <Link href="/auth/login" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Ya tienes cuenta? Inicia sesión</Text>
            </Link>
        </Div>
    )
}

export default RegisterScreen;
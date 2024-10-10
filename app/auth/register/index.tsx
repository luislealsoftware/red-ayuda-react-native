import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, Div, Icon, Input, Select, SelectRef, Text } from 'react-native-magnus';


const RegisterScreen = () => {

    const [country, setCountry] = useState("");
    const countryRef = React.createRef<SelectRef>();

    const onSelectOption = (value: any) => {
        setCountry(value);
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
                prefix={<Icon name="user" color="gray900" fontFamily="Feather" />} />

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

            <Input mt="md" placeholder='Fecha de nacimiento' p={10} focusBorderColor="blue700" />

            <Input
                mt="md"
                placeholder="Número de teléfono"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="phone" color="gray900" fontFamily="Feather" />} />

            <Input
                mt="md"
                placeholder="Usuario"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="user" color="gray900" fontFamily="Feather" />}
            />

            <Input
                mt="md"
                placeholder="Correo electrónico"
                p={10}
                focusBorderColor="blue700"
                prefix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
            />

            <Input
                placeholder="Contraseña"
                mt="md"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}
            />

            <Input
                placeholder="Repetir contraseña"
                mt="md"
                p={10}
                secureTextEntry
                focusBorderColor="blue700"
                prefix={<Icon name="lock" color="gray900" fontFamily="Feather" />}

            />

            {/* Accept terms and conditions */}
            <Div row mt="md">
                <Icon
                    name="check"
                    color="blue700"
                    fontFamily="Feather"
                    fontSize="2xl"
                    mr="md"
                />
                <Text>
                    Al registrarme, acepto los términos y condiciones de uso.
                </Text></Div>

            <Div>
                <Button block mt="md" bg="blue700" color="white">
                    Registrarme</Button>
            </Div>

            <Link href="/auth/login" style={{ marginTop: 10 }}>
                <Text textAlign="center">¿Ya tienes cuenta? Inicia sesión</Text>
            </Link>

        </Div>
    )
}

export default RegisterScreen;
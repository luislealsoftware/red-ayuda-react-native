import { Input, Form, Button } from '@ant-design/react-native';
import React from 'react';

const HomePage = () => {
    return (
        // <Input prefix="icon" placeholder="Basic Input" />
        <Form>
            <Form.Item label="Correo electrónico">
                <Input type='text' placeholder="usuario@micorreo.com" />
            </Form.Item>
            <Form.Item label="Contraseña">
                <Input type='password' placeholder="Contraseña" />
            </Form.Item>
            <Form.Item>
                <Button type="primary">Registrarme</Button>
            </Form.Item>
        </Form>
    );
}

export default HomePage;
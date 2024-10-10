import { Link } from 'expo-router';
import React from 'react';

const HomePage = () => {
    return (
        <Link href="/auth/register">
            Registro
        </Link>
    );
}

export default HomePage;
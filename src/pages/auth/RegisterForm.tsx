import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from './RegisterForm.scss'

interface Props {
    onRegister: (username: string, password: string) => void;
}

const RegisterForm: React.FC<Props> = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleRegister = () => {
        if (password === confirmPassword) {
            onRegister(username, password);
        } else {
            setPasswordsMatch(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Username"
                mode="outlined"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                label="Confirm Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setPasswordsMatch(password === text);
                }}
            />
            {!passwordsMatch && (
                <Text style={styles.passwordMatchError}>Passwords do not match!</Text>
            )}
            <Button mode="contained" style={styles.button} onPress={handleRegister}>
                Register
            </Button>
        </View>
    );
};

export default RegisterForm;

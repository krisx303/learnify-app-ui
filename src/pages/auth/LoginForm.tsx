import React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from './LoginForm.scss'

interface Props {
    onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        onLogin(username, password);
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Login"
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
            <Button mode="contained" style={styles.button} onPress={handleLogin}>
                Login
            </Button>
        </View>
    );
};

export default LoginForm;

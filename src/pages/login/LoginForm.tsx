import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

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

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        padding: 100
    },
    input: {
        marginBottom: 20,
        width: '70%',
        minWidth: 250, // Minimum width for inputs
        maxWidth: 400,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#390854',
        width: '70%',
        minWidth: 200, // Minimum width for buttons
        maxWidth: 400,
    },
});

export default LoginForm;

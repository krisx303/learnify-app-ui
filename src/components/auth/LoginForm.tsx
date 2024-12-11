import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import AsyncButton from "./AsyncButton";

interface Props {
    onLogin: (username: string, password: string) => void;
    loading: boolean;
}

const LoginForm: React.FC<Props> = ({onLogin, loading}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        onLogin(email, password);
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                mode="flat"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                label="Password"
                mode="flat"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <AsyncButton loading={loading} onPress={handleLogin} buttonText="Login"/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 20,
        width: '70%',
        minWidth: 250,
        maxWidth: 400,
    },
})

export default LoginForm;

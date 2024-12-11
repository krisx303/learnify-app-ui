import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import AsyncButton from "./AsyncButton";

interface Props {
    onRegister: (email: string, password: string) => void;
    loading: boolean;
}

const RegisterForm: React.FC<Props> = ({onRegister, loading}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleRegister = () => {
        if (password === confirmPassword) {
            onRegister(email, password);
        } else {
            setPasswordsMatch(false);
        }
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
            <TextInput
                label="Confirm Password"
                mode="flat"
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
            <AsyncButton loading={loading} onPress={handleRegister} buttonText="Register"/>
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
    passwordMatchError: {
        color: 'red',
        marginBottom: 10,
    }
})

export default RegisterForm;

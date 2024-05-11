import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './RegisterForm.scss'
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

export default RegisterForm;

import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import LoginForm from "../login/LoginForm";

//TODO add authentication state and redirect to the MainPage when user is already authenticated

const LoginPage = () => {
    const { width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation(); // Initialize navigation

    const onLogin = (username: string, password: string) => {
        //TODO implement the authentication of users
        navigation.navigate("Main");
    };

    return (
        <View style={styles.container}>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={styles.logoContainer}>
                    <LearnifyAppLogo size={200} />
                    <Text style={styles.description}>
                        Welcome back to Learnify! Login to continue learning.
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <LoginForm onLogin={onLogin} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#590d82',
        width: '100%',
        height: '100%',
    },
    contentHorizontal: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    contentVertical: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    formContainer: {
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderWidth: 0,
        margin: 0,
    },
    description: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'sans-serif',
        width: '100%',
    },
});

export default LoginPage;

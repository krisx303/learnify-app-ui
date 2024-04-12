import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
    const { width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation();

    const onRegister = (username: string, password: string) => {
        // TODO: Implement registration logic
        console.log("Registered:", username, password);
        // After successful registration, navigate to the main page
        navigation.navigate("Main");
    };

    const navigateToLoginPage = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={styles.logoContainer}>
                    <LearnifyAppLogo size={200} />
                    <Text style={styles.description}>
                        Join Learnify and start your learning journey!
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <RegisterForm onRegister={onRegister} />
                    <TouchableOpacity onPress={navigateToLoginPage}>
                        <Text style={styles.hyperlink}>A returning user? Log in instead</Text>
                    </TouchableOpacity>
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
    hyperlink: {
        color: '#ffffff',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});

export default RegisterPage;

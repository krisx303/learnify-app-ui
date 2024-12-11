import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../../firebase";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {useAuth} from "../../components/auth/AuthProvider";
import LoginForm from "../../components/auth/LoginForm";
import AuthPageView from "../../components/auth/AuthPageView";
//TODO add authentication state and redirect to the MainPage when user is already authenticated

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigation = useNavigation<NavigationProps>();
    const authentication = useAuth();

    const login = (email: string, password: string) => {
        setLoading(true);
        setErrorMessage("");
        signInWithEmailAndPassword(auth, email, password)
            .then(onLoggedIn)
            .catch(onLoginFailed);
    }

    const onLoggedIn = (credentials: any) => {
        setLoading(false);
        setErrorMessage("")
        authentication.setUser(credentials.user);
        navigation.navigate("Main");
    }

    const onLoginFailed = (error: any) => {
        setLoading(false);
        setErrorMessage(error.message);
    }

    const navigateToRegisterPage = () => {
        navigation.navigate("Register");
    };

    const WelcomeInformation = () => (
        <>
            <LearnifyAppLogo size={200} />
            <Text style={styles.description}>
                Welcome back to Learnify! Login to continue learning.
            </Text>
        </>
    );

    const Form = () => (
        <>
            <LoginForm onLogin={login} loading={loading} />
            {errorMessage && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <TouchableOpacity onPress={navigateToRegisterPage}>
                <Text style={styles.hyperlink}>Do not have an account? Create new here</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <AuthPageView
            leftContent={<WelcomeInformation />}
            rightContent={<Form />}
        />
    );
};

const styles = StyleSheet.create({
    description: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'sans-serif',
        width: '100%',
    },
    hyperlink: {
        color: '#fff',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
    errorMessage: {
        color: '#ff0000',
        marginTop: 10,
    },
})

export default LoginPage;

import React, {useState} from 'react';
import {Text, TouchableOpacity, useWindowDimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import RegisterForm from "../../components/auth/RegisterForm";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../../firebase";
import {useAuth} from "../../components/auth/AuthProvider";
import {useHttpClient} from "../../transport/HttpClient";
import AuthPageView from "../../components/auth/AuthPageView";

type NavigationProps = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {width: windowWidth} = useWindowDimensions();
    const navigation = useNavigation<NavigationProps>();
    const authentication = useAuth();
    const httpClient = useHttpClient();

    const register = (email: string, password: string) => {
        setLoading(true)
        setErrorMessage("");
        createUserWithEmailAndPassword(auth, email, password)
            .then(onRegistered)
            .catch(onRegisterFailed);
    };

    const onRegistered = (credentials: any) => {
        setLoading(false);
        setErrorMessage("");
        authentication.setUser(credentials.user);
        httpClient.registerUser(credentials.user.email, credentials.user.email.substring(0, credentials.user.email.indexOf('@')))
            .then(() => navigation.navigate("Main"))
            .catch(console.error);
    };

    const onRegisterFailed = (error: any) => {
        setLoading(false)
        setErrorMessage(error.message);
    };

    const navigateToLoginPage = () => {
        navigation.navigate("Login");
    };

    const WelcomeInformation = () => (
        <>
            <LearnifyAppLogo size={200}/>
            <Text style={styles.description}>
                Join Learnify and start your learning journey!
            </Text>
        </>
    );

    const Form = () => (
        <>
            <RegisterForm onRegister={register} loading={loading}/>
            {errorMessage && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <TouchableOpacity onPress={navigateToLoginPage}>
                <Text style={styles.hyperlink}>A returning user? Log in instead</Text>
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

export default RegisterPage;

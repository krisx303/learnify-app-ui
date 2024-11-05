import React, {useState} from 'react';
import {View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import RegisterForm from "./RegisterForm";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import styles from './RegisterPage.scss';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../../firebase";
import {useAuth} from "./AuthProvider";
import {useHttpClient} from "../../transport/HttpClient";

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

    return (
        <View style={styles.container}>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={styles.logoContainer}>
                    <LearnifyAppLogo size={200}/>
                    <Text style={styles.description}>
                        Join Learnify and start your learning journey!
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <RegisterForm onRegister={register} loading={loading}/>
                    {errorMessage && (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    )}
                    <TouchableOpacity onPress={navigateToLoginPage}>
                        <Text style={styles.hyperlink}>A returning user? Log in instead</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default RegisterPage;

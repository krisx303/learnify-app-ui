import React, {useState} from 'react';
import {View, Text, useWindowDimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import LoginForm from "./LoginForm";
import styles from "./LoginPage.scss";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../../firebase";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
import {useAuth} from "./AuthProvider";
//TODO add authentication state and redirect to the MainPage when user is already authenticated

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {width: windowWidth} = useWindowDimensions();
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

    return (
        <View style={styles.container}>
            <View style={windowWidth < 700 ? styles.contentVertical : styles.contentHorizontal}>
                <View style={styles.logoContainer}>
                    <LearnifyAppLogo size={200}/>
                    <Text style={styles.description}>
                        Welcome back to Learnify! Login to continue learning.
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <LoginForm onLogin={login} loading={loading}/>
                    {errorMessage && (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    )}
                    <TouchableOpacity onPress={navigateToRegisterPage}>
                        <Text style={styles.hyperlink}>Do not have an account? Create new here</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginPage;

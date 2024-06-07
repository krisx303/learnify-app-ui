import React from 'react';
import {View, Text, useWindowDimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import LoginForm from "./LoginForm";
import styles from "./LoginPage.scss";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";
//TODO add authentication state and redirect to the MainPage when user is already authenticated

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
    const {width: windowWidth} = useWindowDimensions();
    const navigation = useNavigation<NavigationProps>();

    const onLogin = (username: string, password: string) => {
        //TODO implement the authentication of users
        navigation.navigate("Main");
    };

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
                    <LoginForm onLogin={onLogin}/>
                    <TouchableOpacity onPress={navigateToRegisterPage}>
                        <Text style={styles.hyperlink}>Do not have an account? Create new here</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginPage;

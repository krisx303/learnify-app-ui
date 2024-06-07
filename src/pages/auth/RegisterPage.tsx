import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LearnifyAppLogo from "../../icons/learnify-app-logo";
import RegisterForm from "./RegisterForm";
import styles from './RegisterPage.scss'
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";

type NavigationProps = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterPage = () => {
    const { width: windowWidth } = useWindowDimensions();
    const navigation = useNavigation<NavigationProps>();

    const onRegister = (username: string, password: string) => {
        // TODO: Implement registration logic
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

export default RegisterPage;

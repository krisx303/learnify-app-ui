import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Platform } from 'react-native'; // Import Platform module
import LoginPage from './src/pages/login/LoginPage';
import MainPage from './src/pages/main/MainPage';
import RegisterPage from "./src/pages/login/RegisterPage";
import { Linking } from 'react-native';

const Stack = createStackNavigator();

const App: React.FC = () => {
    const isPhone = Platform.OS === 'android' || Platform.OS === 'ios'; // Check if the platform is Android or iOS

    const navigationOptions = {
        headerShown: false,
        animationEnabled: isPhone,
        cardStyleInterpolator: isPhone ? CardStyleInterpolators.forHorizontalIOS : undefined
    };

    return (
        <NavigationContainer
            linking={{
                prefixes: isPhone ? ['learnify://'] : ['https://learnify.pl'],
                config: {
                    screens: {
                        Register: 'register',
                        Login: 'login',
                        Main: 'main'
                    }
                },
            }}
            onReady={() => {
                if (!isPhone) {
                    const { initialURL } = Linking.getInitialURL();
                    if (initialURL) {
                        const route = initialURL.includes('login') ? 'Login' :
                            initialURL.includes('main') ? 'Main' : 'Register';
                        console.log('Navigating to:', route);
                        Linking.openURL(route);
                    }
                }
            }}
        >
            <Stack.Navigator initialRouteName="Register">
                <Stack.Screen
                    name="Register"
                    component={RegisterPage}
                    options={navigationOptions}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={navigationOptions}
                />
                <Stack.Screen
                    name="Main"
                    component={MainPage}
                    options={navigationOptions}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import MainPage from "./src/pages/main/MainPage";
import LoginPage from "./src/pages/auth/LoginPage";
import RegisterPage from "./src/pages/auth/RegisterPage";
import CardPage from "./src/pages/CardPage"; // Import the CardPage component
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { Platform, Text, View } from "react-native";
import QuizPage from "./src/pages/QuizPage";

const Stack = createStackNavigator();

const linking = {
    prefixes: ['https://learnify.pl', 'learnify://'],
    config: {
        screens: {
            Main: '',
            Login: '/login',
            Register: '/register',
            CardPage: 'workspaces/:workspaceId/notes/:noteId',
            QuizPage: 'workspaces/:workspaceId/quizzes/:quizId',
        },
    },
};

function App() {
    const isPhone = Platform.OS === 'android' || Platform.OS === 'ios'; // Check if the platform is Android or iOS

    const navigationOptions = {
        headerShown: false,
        animationEnabled: isPhone,
        cardStyleInterpolator: isPhone ? CardStyleInterpolators.forHorizontalIOS : undefined
    };


    return (
        <NavigationContainer linking={linking} fallback={<View><Text>Loading</Text></View>}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Main" component={MainPage} options={navigationOptions}/>
                <Stack.Screen name="Login" component={LoginPage} options={navigationOptions}/>
                <Stack.Screen name="Register" component={RegisterPage} options={navigationOptions}/>
                <Stack.Screen name="CardPage" component={CardPage} options={navigationOptions}/>
                <Stack.Screen name="QuizPage" component={QuizPage} options={navigationOptions}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

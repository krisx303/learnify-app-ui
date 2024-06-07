import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import MainPage from "./src/pages/main/MainPage";
import LoginPage from "./src/pages/auth/LoginPage";
import RegisterPage from "./src/pages/auth/RegisterPage";
import CardPage from "./src/pages/CardPage";
import {createStackNavigator, CardStyleInterpolators} from "@react-navigation/stack";
import {Platform, Text, View} from "react-native";
import QuizPage from "./src/pages/quiz/summmary/QuizPage";
import QuestionsScreen from "./src/pages/quiz/solving/QuestionsScreen";
import {Question} from "./src/pages/quiz/solving/Question";
import {QuizDetails} from "./src/pages/quiz/summmary/QuizDetails";
import QuizEditor from "./src/pages/quiz/creation/QuizEditor";

const Stack = createStackNavigator();

export type RootStackParamList = {
    Main: undefined;
    Login: undefined;
    Register: undefined;
    CardPage: { workspaceId: string, noteId: string };
    QuizPage: { workspaceId: string, quizId: string };
    // TODO delete advanced objects from route
    QuestionsScreen: { questions: Question[]; quizId: string, quiz: QuizDetails };
    QuizEditor: { workspaceId: string, quizId: string };
};

const linking = {
    prefixes: ['https://learnify.pl', 'learnify://'],
    config: {
        screens: {
            Main: '',
            Login: '/login',
            Register: '/register',
            CardPage: 'workspaces/:workspaceId/notes/:noteId',
            QuizPage: 'workspaces/:workspaceId/quizzes/:quizId',
            QuestionsScreen: 'quizzes/:quizId/',
            QuizEditor: 'workspaces/:workspaceId/quizzes/:quizId/edit'
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
                <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} options={navigationOptions}/>
                <Stack.Screen name="QuizEditor" component={QuizEditor} options={navigationOptions}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;

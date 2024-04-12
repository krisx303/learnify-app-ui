import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/login/LoginPage';
import MainPage from './src/pages/main/MainPage';

const Stack = createStackNavigator();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

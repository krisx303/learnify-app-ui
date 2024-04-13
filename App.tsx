import {NavigationContainer} from "@react-navigation/native";
import MainPage from "./src/pages/main/MainPage";
import LoginPage from "./src/pages/login/LoginPage";
import RegisterPage from "./src/pages/login/RegisterPage";
import {createStackNavigator, CardStyleInterpolators} from "@react-navigation/stack";
import {Platform, Text, View} from "react-native";

const Stack = createStackNavigator();

const linking = {
    prefixes: ['https://learnify.pl', 'learnify://'],
    config: {
        screens: {
            Main: '',
            Login: '/login',
            Register: '/register',
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
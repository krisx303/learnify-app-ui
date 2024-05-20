import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from './TopBar.scss';
import LearnifyAppIconInner from "../../icons/learnify-app-icon-inner";
import {RootStackParamList} from "../../../App";
import {StackNavigationProp} from "@react-navigation/stack";

interface TopBarProps {
    text?: string;
    children?: React.ReactElement;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const TopBar: React.FC<TopBarProps> = ({text, children}) => {
    const navigation = useNavigation<NavigationProps>();
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };

    const handleLearnifyPress = () => {
        navigation.navigate('Main');
    };

    return (
        <View style={styles.topBar}>
            <View style={styles.leftContent}>
                <TouchableHighlight onPress={handleLearnifyPress} underlayColor="transparent">
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <LearnifyAppIconInner/>
                        {text ? <Text style={styles.topBarText}>{text}</Text> :
                            <Text style={styles.topBarText}>Learnify</Text>}
                    </View>
                </TouchableHighlight>
                {children}
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Avatar.Image size={40} source={{uri: user.avatarUrl}}/>
            </View>
        </View>
    );
};

export default TopBar;

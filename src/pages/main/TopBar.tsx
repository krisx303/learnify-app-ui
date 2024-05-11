import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from './TopBar.scss';
import LearnifyAppIconInner from "../../icons/learnify-app-icon-inner";

interface TopBarProps {
    username: string;
    avatarUrl: string;
    text: string | undefined;
}

const TopBar: React.FC<TopBarProps> = ({username, avatarUrl, text}) => {
    const navigation = useNavigation();

    const handleLearnifyPress = () => {
        navigation.navigate('Main'); // Navigate to the main screen
    };

    return (
        <View style={styles.topBar}>
            <TouchableHighlight onPress={handleLearnifyPress} underlayColor="transparent">
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <LearnifyAppIconInner/>
                    {text ? <Text style={styles.topBarText}>{text}</Text> :
                        <Text style={styles.topBarText}>Learnify</Text>}
                </View>
            </TouchableHighlight>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{username}</Text>
                <Avatar.Image size={40} source={{uri: avatarUrl}}/>
            </View>
        </View>
    );
};

export default TopBar;

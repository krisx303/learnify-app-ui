import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './TopBar.scss';

interface TopBarProps {
    username: string;
    avatarUrl: string;
}

const TopBar: React.FC<TopBarProps> = ({ username, avatarUrl }) => {
    const navigation = useNavigation();

    const handleLearnifyPress = () => {
        navigation.navigate('Main'); // Navigate to the main screen
    };

    return (
        <View style={styles.topBar}>
            <TouchableHighlight onPress={handleLearnifyPress} underlayColor="transparent">
                <Text style={styles.topBarText}>Learnify</Text>
            </TouchableHighlight>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{username}</Text>
                <Avatar.Image size={40} source={{ uri: avatarUrl }} />
            </View>
        </View>
    );
};

export default TopBar;

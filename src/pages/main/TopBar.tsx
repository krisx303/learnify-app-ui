import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import styles from './TopBar.scss';

interface TopBarProps {
    username: string;
    avatarUrl: string;
}

const TopBar: React.FC<TopBarProps> = ({ username, avatarUrl }) => {
    return (
        <View style={styles.topBar}>
            <Text style={styles.topBarText}>Learnify</Text>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{username}</Text>
                <Avatar.Image size={40} source={{ uri: avatarUrl }} />
            </View>
        </View>
    );
};

export default TopBar;

import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from './TopBar.scss';
import LearnifyAppIconInner from "../../icons/learnify-app-icon-inner";
import {RootStackParamList} from "../../../App";
import {StackNavigationProp} from "@react-navigation/stack";

interface TopBarProps {
    text?: string;
    children?: React.ReactElement;
    withAdvancedMenu?: boolean;
    onAdvancedMenuPress?: () => void;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const TopBar: React.FC<TopBarProps> = ({text, withAdvancedMenu, onAdvancedMenuPress, children}) => {
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
            {withAdvancedMenu && (
                <View>
                    <Text style={{color: "white", fontSize: 25}}>{'< 1/1 >'}</Text>
                </View>
            )}
            {withAdvancedMenu === true ? (
                <Button icon="abacus" mode="contained" onPress={onAdvancedMenuPress}>
                    View Quizzes
                </Button>
            ) : (<View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Avatar.Image size={40} source={{uri: user.avatarUrl}}/>
            </View>)}

        </View>
    );
};

export default TopBar;

import React, {useState} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native';
import {Avatar, Button, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from './TopBar.scss';
import LearnifyAppIconInner from "../../icons/learnify-app-icon-inner";
import {RootStackParamList} from "../../../App";
import {StackNavigationProp} from "@react-navigation/stack";
import {useAuth} from "../auth/AuthProvider";

interface TopBarProps {
    workspaceName?: string;
    workspaceId?: string;
    text?: string;
    children?: React.ReactElement;
    withAdvancedMenu?: boolean;
    onAdvancedMenuPress?: () => void;
    optionsButtonText?: string;
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const TopBar: React.FC<TopBarProps> = ({optionsButtonText, workspaceName, workspaceId, text, withAdvancedMenu, onAdvancedMenuPress, children}) => {
    const navigation = useNavigation<NavigationProps>();
    const {username, userProfileUri, removeUser} = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);

    const logout = () => {
        removeUser();
        navigation.navigate('Login');
        setMenuVisible(false);
    };

    return (
        <View style={styles.topBar}>
            <View style={styles.leftContent}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableHighlight onPress={() => navigation.navigate('Main')} underlayColor="transparent">
                        <LearnifyAppIconInner/>
                    </TouchableHighlight>
                    {workspaceName && workspaceId && <TouchableHighlight onPress={() => navigation.navigate('WorkspacePage', {workspaceId: workspaceId })} underlayColor="transparent">
                        <Text style={[styles.topBarText, {marginRight: 5}]}>{workspaceName}</Text>
                    </TouchableHighlight>}
                    {workspaceName && <Icon size={25} source="arrow-right" color="white"/>}
                    <Text style={styles.topBarText}>{text || 'Learnify'}</Text>
                </View>
                {children}
            </View>

            <View style={{flexDirection: "row"}}>
                {withAdvancedMenu && (
                    <Button icon="abacus" mode="contained" onPress={onAdvancedMenuPress} style={{marginRight: 10}}>
                        {optionsButtonText || "Options"}
                    </Button>
                )}
                <TouchableOpacity onPress={toggleMenu} style={styles.userInfo}>
                    {!withAdvancedMenu && <Text style={styles.username}>{username}</Text>}
                    <Avatar.Image size={40} source={{uri: userProfileUri || "../../../assets/default-avatar.png"}}/>
                </TouchableOpacity>
            </View>

            {menuVisible && (
                <TouchableOpacity style={sad.dropdownOverlay} onPress={toggleMenu}>
                    <View style={sad.dropdownMenu}>
                        <Text style={sad.username}>{username}</Text>
                        <TouchableOpacity style={sad.menuItem} onPress={logout}>
                            <Text style={sad.menuText}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};


const sad = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#333',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBarText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 8,
    },
    dropdownOverlay: {
        position: 'absolute',
        top: 70, // Adjust this value based on avatar position
        right: 16,
        width: 'auto',
        height: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Only a light overlay around the dropdown
        borderRadius: 8,
    },
    dropdownMenu: {
        width: 200,
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});


export default TopBar;

import {useAuth} from "../../pages/auth/AuthProvider";
import React, {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Avatar} from "react-native-paper";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../../App";

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

const UserDetailsWithMenu = ({displayUsername = false}: { displayUsername?: boolean }) => {
    const {username, userProfileUri, removeUser} = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation<NavigationProps>();
    const toggleMenu = () => setMenuVisible(!menuVisible);

    const logout = () => {
        removeUser();
        navigation.navigate('Login');
        setMenuVisible(false);
    };

    return (
        <View style={styles.content}>
            <TouchableOpacity onPress={toggleMenu} style={styles.innerContent}>
                {displayUsername && <Text style={styles.username}>{username}</Text>}
                <Avatar.Image size={40} source={{uri: userProfileUri || "../../../assets/default-avatar.png"}}/>
            </TouchableOpacity>
            {menuVisible && (
                <TouchableOpacity style={styles.dropdownOverlay} onPress={toggleMenu}>
                    <View style={styles.dropdownMenu}>
                        <Text style={styles.usernameMenuItem}>{username}</Text>
                        <TouchableOpacity style={styles.menuItem} onPress={logout}>
                            <Text style={styles.menuText}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default UserDetailsWithMenu;

const styles = StyleSheet.create({
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
        color: 'white',
        marginRight: 10,
    },
    usernameMenuItem: {
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
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    innerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
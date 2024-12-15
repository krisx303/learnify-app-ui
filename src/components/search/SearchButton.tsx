import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can replace this with any icon library

const SearchButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>Search Resource</Text>
            <FontAwesome name="search" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3c0b69',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginLeft: 20
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
    icon: {
        marginLeft: 5,
    },
});

export default SearchButton;

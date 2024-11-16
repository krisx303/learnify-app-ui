import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DropdownButton = ({setDropdownVisible, dropdownVisible, onItemSelected}: {setDropdownVisible: any, dropdownVisible: boolean, onItemSelected: any}) => {
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleDropdownItemPress = (item: string) => {
        setDropdownVisible(false);
        onItemSelected(item);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDropdown}>
                <Text style={styles.buttonText}>Create new</Text>
            </TouchableOpacity>
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('Workspace')}>
                        <Text style={styles.dropdownItem}>Workspace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('Note')}>
                        <Text style={styles.dropdownItem}>Note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('Quiz')}>
                        <Text style={styles.dropdownItem}>Quiz</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 30
    },
    buttonText: {
        color: '#ffd800',
        borderColor: '#ffd800',
        borderRadius: 20,
        borderWidth: 2,
        paddingVertical: 7,
        paddingHorizontal: 20,
        fontSize: 20
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: '#390854',
        borderRadius: 10,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        zIndex: 1000,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ccc',
    },
    dropdownItem: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderStyle: 'solid',
        color: 'white',
        zIndex: 10
    }
});

export default DropdownButton;
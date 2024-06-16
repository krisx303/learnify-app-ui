import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './DropdownButton.scss';

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
            <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
                <Text style={styles.buttonText}>Create new</Text>
            </TouchableOpacity>
            {dropdownVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('Workspace')}>
                        <Text style={styles.dropdownItem}>Workspace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('HandWrittenNote')}>
                        <Text style={styles.dropdownItem}>HandWritten Note</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDropdownItemPress('Quiz')}>
                        <Text style={styles.dropdownItem}>Quiz</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default DropdownButton;
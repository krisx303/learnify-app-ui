import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MainPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Main Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#590d82',
    },
    text: {
        fontSize: 20,
        color: '#ffffff',
    },
});

export default MainPage;

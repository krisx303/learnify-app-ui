import React from 'react';
import {Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Button} from "react-native-paper";

interface AsyncButtonProps {
    loading: boolean;
    onPress: () => void;
    buttonText: string;
}

const AsyncButton: React.FC<AsyncButtonProps> = ({loading, onPress, buttonText}) => {
    return (
        <Button mode="contained" onPress={onPress} disabled={loading} style={styles.button}>
            {loading ? (
                <ActivityIndicator size="small" color="#fff" style={styles.spinner}/>
            ) : (
                <Text>{buttonText}</Text>
            )}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        backgroundColor: '#590d82',
        width: '70%',
        minWidth: 200,
        maxWidth: 400,
    },
    spinner: {
        marginRight: 10,
    },
})

export default AsyncButton;

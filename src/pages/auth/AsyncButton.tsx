import React from 'react';
import {Text, ActivityIndicator} from 'react-native';
import styles from './AsyncButton.scss';
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
                <Text style={styles.buttonText}>{buttonText}</Text>
            )}
        </Button>
    );
};

export default AsyncButton;

import React from "react";
import {StyleSheet, Text, TouchableHighlight} from "react-native";

export type BreadCrumbProps = {
    text: string;
    onPress?: () => void;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({text, onPress}) => {
    if (onPress) {
        return (
            <TouchableHighlight onPress={onPress} underlayColor="transparent">
                <Text style={styles.topBarWhiteText}>{text}</Text>
            </TouchableHighlight>
        )
    }
    return (<Text style={styles.topBarWhiteText}>{text}</Text>);
};

export default BreadCrumb;

const styles = StyleSheet.create({
    topBarWhiteText: {
        marginLeft: 10,
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 20,
    },
});
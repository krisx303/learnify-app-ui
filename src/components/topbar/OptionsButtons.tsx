import {Button} from "react-native-paper";
import React from "react";

type OptionsButtonsProps = {
    text?: string;
    onPress: () => void;
}

const OptionsButtons = ({text, onPress}: OptionsButtonsProps) => {
    return (
        <Button icon="abacus" mode="contained" onPress={onPress} style={{marginRight: 10}}>
            {text || "Options"}
        </Button>
    )
};

export default OptionsButtons;
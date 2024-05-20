import {Picker, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Workspace} from "../Types";

interface WorkspaceDropdownSelectorProps {
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
    workspaceOptions: Workspace[];
}

export const WorkspaceDropdownSelector = (props: WorkspaceDropdownSelectorProps) => <View>
    <Text style={styles.label}>Workspace</Text>
    <Picker
        selectedValue={props.selectedValue}
        style={styles.picker}
        onValueChange={props.onValueChange}
    >
        {props.workspaceOptions.map(workspace =>
            <Picker.Item key={workspace} label={workspace.name} value={workspace.id}/>
        )}
    </Picker>
</View>;


const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
    },
    picker: {
        padding: 10,
        height: 50,
        width: '100%',
    },
});
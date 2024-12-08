import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export type WorkspaceProps = {
    displayName: string;
    id: string;
}

const WorkspaceDropdown = ({
                               workspaces,
                               selectedWorkspace,
                               setSelectedWorkspace,
                           }: {
    workspaces: WorkspaceProps[];
    selectedWorkspace?: WorkspaceProps;
    setSelectedWorkspace: (workspace: WorkspaceProps | undefined) => void;
}) => {
    const [isFocus, setIsFocus] = useState(false);

    // Prepare data for dropdown
    const data = workspaces.map((workspace) => ({ label: workspace.displayName, value: workspace.id }));

    return (
        <View style={styles.container}>
            {selectedWorkspace || isFocus ? (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>Workspace</Text>
            ) : null}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select workspace' : '...'}
                searchPlaceholder="Search workspace..."
                value={selectedWorkspace?.id}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    setSelectedWorkspace(item.value ? workspaces.find(workspace => workspace.id === item.value) : undefined);
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="folderopen"
                        size={20}
                    />
                )}
            />
            {selectedWorkspace && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSelectedWorkspace(undefined)} // Clear the selection
                >
                    <AntDesign name="closecircle" size={25} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default WorkspaceDropdown;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        position: 'relative',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    clearButton: {
        borderRadius: 50,
        backgroundColor: 'white',
        position: 'absolute',
        right: 25,
        top: 25,
    }
});

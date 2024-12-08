import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export type OwnerProps = {
    displayName: string;
    id: string;
}

const OwnerDropdown = ({ owners, selectedOwner, setSelectedOwner }: {
    owners: OwnerProps[];
    selectedOwner?: OwnerProps;
    setSelectedOwner: (owner: OwnerProps | undefined) => void;
}) => {
    const [isFocus, setIsFocus] = useState(false);

    // Prepare data for dropdown
    const data = owners.map((owner) => ({ label: owner.displayName, value: owner.id }));

    return (
        <View style={styles.container}>
            {selectedOwner || isFocus ? (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>Owner</Text>
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
                placeholder={!isFocus ? 'Select owner' : '...'}
                searchPlaceholder="Search owner..."
                value={selectedOwner?.id}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    setSelectedOwner(item.value ? owners.find(owner => owner.id === item.value) : undefined);
                    setIsFocus(false);
                }}
                renderLeftIcon={() => (
                    <AntDesign
                        style={styles.icon}
                        color={isFocus ? 'blue' : 'black'}
                        name="user"
                        size={20}
                    />
                )}
            />
            {selectedOwner && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setSelectedOwner(undefined)} // Clear the selection
                >
                    <AntDesign name="closecircle" size={25} color="gray" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default OwnerDropdown;

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
    },
});

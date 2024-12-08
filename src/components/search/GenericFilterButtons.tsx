import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

type FilterButtonProps = {
    label: string;
    value: any;
    selectedValue: any;
    onSelect: (value: any) => void;
};

const FilterButton: React.FC<FilterButtonProps> = ({ label, value, selectedValue, onSelect }) => {
    return (
        <Button
            mode={selectedValue === value ? 'contained' : 'outlined'}
            onPress={() => onSelect(selectedValue === value ? undefined : value)}
            style={styles.filterButton}
        >
            {label}
        </Button>
    );
};

type GenericFilterButtonsProps = {
    label: string;
    options: { label: string; value: any }[];
    selectedValue: any;
    onSelect: (value: any) => void;
};

const GenericFilterButtons: React.FC<GenericFilterButtonsProps> = ({ label, options, selectedValue, onSelect }) => {
    return (
        <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>{label}</Text>
            <View style={styles.filterOptions}>
                {options.map((option) => (
                    <FilterButton
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        selectedValue={selectedValue}
                        onSelect={onSelect}
                    />
                ))}
            </View>
        </View>
    );
};

export default GenericFilterButtons;

const styles = StyleSheet.create({
    filterContainer: {
        marginVertical: 16,
    },
    filterLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    filterOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterButton: {
        flex: 1,
        marginHorizontal: 4,
    },
});

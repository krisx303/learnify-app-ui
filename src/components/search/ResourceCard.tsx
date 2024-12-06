import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

type ResourceCardProps = {
    resource: {
        id: string;
        title: string;
        resourceType: string;
        author: {
            displayName: string;
        };
        workspace: {
            displayName: string;
        };
        accessType: string;
    };
    onPress: () => void; // Optional: onPress callback for the card
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress }) => {
    return (
        <TouchableOpacity key={resource.id} style={styles.resourceItem} onPress={onPress}>
            <View style={styles.resourceHeader}>
                <Text style={styles.resourceName}>{resource.title}</Text>
                <Text style={styles.resourceType}>{resource.resourceType}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.resourceDetails}>
                <Text style={styles.resourceDetail}>
                    <Text style={styles.detailLabel}>Owner:</Text> {resource.author.displayName}
                </Text>
                <Text style={styles.resourceDetail}>
                    <Text style={styles.detailLabel}>Workspace:</Text> {resource.workspace.displayName}
                </Text>
                <Text style={styles.resourceDetail}>
                    <Text style={styles.detailLabel}>Visibility:</Text> {resource.accessType}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ResourceCard;

const styles = StyleSheet.create({
    resourceItem: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resourceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resourceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resourceType: {
        fontSize: 14,
        color: 'gray',
    },
    divider: {
        marginVertical: 8,
    },
    resourceDetails: {
        marginTop: 8,
    },
    resourceDetail: {
        fontSize: 14,
        marginBottom: 4,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
});

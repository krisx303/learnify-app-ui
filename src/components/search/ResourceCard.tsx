import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { ResourceSummary } from "../../transport/HttpClient";
import ProgressBar from "../../pages/main/ProgressBar";  // Assuming you're using this for icon

type ResourceCardProps = {
    resource: ResourceSummary;
    onPress: () => void; // Optional: onPress callback for the card
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPress }) => {
    const isNote = resource.resourceType === 'NOTE';
    const isQuiz = resource.resourceType === 'QUIZ';

    // Mocked average rating (you can replace this with actual data later)
    const averageRating = 4;

    return (
        <TouchableOpacity key={resource.id} style={styles.resourceItem} onPress={onPress}>
            <View style={styles.resourceHeader}>
                {/* Icon for resource type */}
                <View style={styles.iconContainer}>
                    {isNote && resource.type === 'DOCUMENT' ? (
                        <MaterialIcons name="description" color="#000" size={26} />
                    ) : isNote && resource.type === 'BOARD' ? (
                        <MaterialIcons name="edit" color="#000" size={26} />
                    ) : isQuiz ? (
                        <MaterialIcons name="school" color="#000" size={26} />
                    ) : null}
                </View>

                {/* Resource title and type */}
                <View style={styles.textContainer}>
                    <Text style={styles.resourceName}>{resource.title}</Text>
                    <Text style={styles.resourceType}>{resource.resourceType}</Text>
                </View>
            </View>
            <Divider style={styles.divider} />

            {/* Resource details */}
            <View style={styles.resourceDetails}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>Base Info</Text>
                        <Text style={styles.resourceDetail}>
                            <Text style={styles.detailLabel}>Owner:</Text> {resource.author.displayName}
                        </Text>
                        <Text style={styles.resourceDetail}>
                            <Text style={styles.detailLabel}>Workspace:</Text> {resource.workspace.displayName} ({resource.workspace.author.displayName})
                        </Text>
                    </View>

                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>Details</Text>
                        {isNote && resource.pagesCount !== undefined && (
                            <Text style={styles.resourceDetail}>
                                <Text style={styles.detailLabel}>Pages:</Text> {resource.pagesCount}
                            </Text>
                        )}
                        <Text style={styles.resourceDetail}>
                            <Text style={styles.detailLabel}>Last Visited:</Text> {resource.type || "N/A"}
                        </Text>
                        {isQuiz && resource.score && (resource.score !== "-1") && (
                            <ProgressBar progress={parseInt(resource.score)} />
                        )}
                    </View>

                    <View style={[styles.column, {alignItems: "flex-end"}]}>
                        <Text style={styles.sectionTitle}>Ratings</Text>
                        <View style={styles.starContainer}>
                            <Text style={styles.resourceDetail}>
                                <Text style={styles.detailLabel}>Average:</Text> {averageRating.toFixed(1)}{' '}
                            </Text>
                        </View>
                        <StarRating rating={averageRating} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ResourceCard;

// Star rating component
const StarRating = ({ rating }: { rating: number }) => (
    <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
            <MaterialIcons
                key={index}
                name={index < rating ? 'star' : 'star-border'}
                size={24}
                color="#f2c80c"
            />
        ))}
    </View>
);

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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        marginRight: 16,  // Space between icon and text
    },
    textContainer: {
        flex: 1,  // Make text take up remaining space
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // Align columns in a row
    },
    column: {
        flex: 1,
        paddingRight: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    resourceDetail: {
        fontSize: 14,
        marginBottom: 4,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
});

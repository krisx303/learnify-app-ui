import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet} from "react-native";
import {Button, Card, PaperProvider} from "react-native-paper";
import {useHttpClient} from "../../transport/HttpClient";
import {MaterialIcons} from "@expo/vector-icons";
import {ResourceType, User} from "../../pages/main/Types";
import AddRatingModal, {RatingCreateDetails} from "../modals/AddRatingModal";
import {useAuth} from "../../pages/auth/AuthProvider";
import StarRating from "../StarRating";

type Rating = {
    id: string;
    title: string;
    description: string;
    rating: number;
    userSummary: User;
};

type RatingsTabContentProps = {
    resourceType: ResourceType;
    resourceId: string;
};

const UserRatingCard = ({
                            userRating,
                            onAdd,
                        }: {
    userRating: Rating | null;
    onAdd: () => void;
}) => {
    return (
        userRating ? (
            <Card style={styles.userRatingCard}>
                <Card.Content>
                    <>
                        <Text style={styles.cardTitle}>{userRating.title}</Text>
                        <StarRating rating={userRating.rating}/>
                        <Text style={styles.cardDescription}>{userRating.description}</Text>
                    </>
                </Card.Content>
            </Card>
        ) : (
            <Button onPress={onAdd} mode="contained" style={{width: "fit-content"}}>
                Add Rating
            </Button>
        )
    );
};

const RatingItem = ({rating}: { rating: Rating }) => (
    <Card style={styles.ratingCard}>
        <Card.Content>
            <Text style={styles.cardTitle}>{rating.title}</Text>
            <StarRating rating={rating.rating}/>
            <Text style={styles.cardDescription}>{rating.description}</Text>
            <Text style={styles.cardUser}>By: {rating.userSummary.displayName}</Text>
        </Card.Content>
    </Card>
);

const RatingsTabContent = ({
                               resourceType,
                               resourceId,
                           }: RatingsTabContentProps) => {
    const httpClient = useHttpClient();
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {user} = useAuth();
    const userId = user?.uid ?? "";

    useEffect(() => {
        httpClient
            .getComments(resourceType, resourceId)
            .then((fetchedRatings: Rating[]) => {
                setRatings(fetchedRatings);
                const foundUserRating = fetchedRatings.find(
                    (rating) => rating.userSummary.id === userId
                );
                setUserRating(foundUserRating || null);
            })
            .catch(console.error);
    }, [resourceType, resourceId]);

    const onCreateComment = (rating: RatingCreateDetails) => {
        httpClient.addComment(resourceType, resourceId, rating)
            .then((newRating: Rating) => {
                setRatings([...ratings, newRating]);
                setUserRating(newRating);
            })
            .catch(console.error);
    }

    return (
        <>
            <PaperProvider>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Your Rating</Text>
                    <UserRatingCard
                        userRating={userRating}
                        onAdd={() => setIsModalVisible(true)}
                    />
                    <Text style={styles.sectionTitle}>All Ratings</Text>
                    <FlatList
                        style={{width: "100%"}}
                        data={ratings.filter((rating) => rating.userSummary.id !== userId)}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => <RatingItem rating={item}/>}
                    />
                </View>

            </PaperProvider>
            <AddRatingModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={onCreateComment}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 12,
    },
    starContainer: {
        flexDirection: "row",
        marginVertical: 8,
    },
    userRatingCard: {
        width: "100%",
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    ratingCard: {
        width: "100%",
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    cardDescription: {
        fontSize: 14,
        color: "#555",
        marginVertical: 8,
    },
    cardUser: {
        fontSize: 12,
        color: "#888",
    },
});

export default RatingsTabContent;

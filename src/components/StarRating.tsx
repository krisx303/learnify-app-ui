import {StyleSheet, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";

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

export const StarRatingInput = ({ rating, onRatingChange }: { rating: number, onRatingChange: (rating: number) => void }) => (
    <View style={styles.starContainerInput}>
        {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
                key={value}
                onPress={() => onRatingChange(value)}
            >
                <MaterialIcons
                    name={value <= rating ? "star" : "star-border"}
                    size={32}
                    color="#f2c80c"
                    style={styles.starIcon}
                />
            </TouchableOpacity>
        ))}
    </View>
);

export default StarRating;

const styles = StyleSheet.create({
    starContainerInput: {
        flexDirection: "row",
        marginVertical: 10,
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    starIcon: {
        marginHorizontal: 4,
    },
});

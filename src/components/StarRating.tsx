import {StyleSheet, View} from "react-native";
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

export default StarRating;

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
});

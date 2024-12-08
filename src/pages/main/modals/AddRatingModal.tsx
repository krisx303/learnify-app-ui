import React, {useState} from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {Button, TextInput, Title} from "react-native-paper";
import GenericModal from "./GenericModal";
import {MaterialIcons} from "@expo/vector-icons";
import {StarRatingInput} from "../../../components/StarRating";

export type RatingCreateDetails = {
    title: string;
    description: string;
    rating: number;
};

interface AddRatingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (rating: RatingCreateDetails) => void;
}

const AddRatingModal: React.FC<AddRatingModalProps> = ({
                                                                   isVisible,
                                                                   onClose,
                                                                   onSubmit,
                                                               }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(0);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorRating, setErrorRating] = useState("");

    const handleStarPress = (value: number) => {
        setRating(value);
    };

    const handleRatingSubmit = () => {
        if (title.trim() === "") {
            setErrorTitle("* Title is required");
            return;
        } else {
            setErrorTitle("");
        }
        if (rating === 0) {
            setErrorRating("* Rating is required");
            return;
        } else {
            setErrorRating("");
        }

        onSubmit({title, description, rating});
        setTitle("");
        setDescription("");
        setRating(0);
        setErrorTitle("");
        onClose();
    };

    return (
        <GenericModal visible={isVisible} onClose={onClose}>
            <GenericModal.Header>
                <Title>Add rating</Title>
            </GenericModal.Header>
            <GenericModal.Body>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    label="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                {errorTitle ? <Text style={styles.errorText}>{errorTitle}</Text> : null}
                <TextInput
                    style={[styles.input, {height: 80}]}
                    mode="outlined"
                    label="Description (optional)"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                />
                <Text style={styles.ratingLabel}>Rating:</Text>
                <StarRatingInput rating={rating} onRatingChange={handleStarPress}/>
                {errorRating ? <Text style={styles.errorText}>{errorRating}</Text> : null}
            </GenericModal.Body>
            <GenericModal.Footer>
                <Button
                    mode="outlined"
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                    labelStyle={{color: "#7912b0"}}
                >
                    Cancel
                </Button>
                <Button
                    mode="contained"
                    onPress={handleRatingSubmit}
                    style={[styles.button, styles.submitButton]}
                    labelStyle={{color: "white"}}
                >
                    Submit
                </Button>
            </GenericModal.Footer>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    input: {
        width: "100%",
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    ratingLabel: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    button: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    cancelButton: {
        borderColor: "#7912b0",
    },
    submitButton: {
        backgroundColor: "#7912b0",
    },
});

export default AddRatingModal;

import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Title } from 'react-native-paper';
import GenericModal from "./GenericModal";

export interface StartQuizDetails {
    shuffleQuestions: boolean;
    shuffleAnswers: boolean;
    repeatOnFailure: boolean;
    repeatOnlyFailedQuestions: boolean;
}

interface StartQuizModalProps {
    repeatOnlyFailedQuestionsPossible: boolean;
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (quiz: StartQuizDetails) => void;
}

const StartQuizModal: React.FC<StartQuizModalProps> = ({ isVisible, onClose, onSubmit, repeatOnlyFailedQuestionsPossible }) => {
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [shuffleAnswers, setShuffleAnswers] = useState(false);
    const [repeatOnFailure, setRepeatOnFailure] = useState(false);
    const [repeatOnlyFailedQuestions, setRepeatOnlyFailedQuestions] = useState(false);

    useEffect(() => {
        setRepeatOnFailure(false);
        setRepeatOnlyFailedQuestions(false);
        setShuffleAnswers(false);
        setShuffleQuestions(false);
    }, [isVisible]);

    const handleQuizStart = () => {
        onSubmit({
            shuffleQuestions,
            shuffleAnswers,
            repeatOnFailure,
            repeatOnlyFailedQuestions,
        });
        onClose();
    };

    return (
        <GenericModal visible={isVisible} onClose={onClose}>
            <GenericModal.Header>
                <Title>Start Quiz</Title>
            </GenericModal.Header>
            <GenericModal.Body>
                <View style={styles.option}>
                    <Checkbox
                        status={shuffleQuestions ? 'checked' : 'unchecked'}
                        onPress={() => setShuffleQuestions(!shuffleQuestions)}
                    />
                    <Text style={styles.optionText}>Shuffle Questions - Randomizes the order of quiz questions.</Text>
                </View>
                <View style={styles.option}>
                    <Checkbox
                        status={shuffleAnswers ? 'checked' : 'unchecked'}
                        onPress={() => setShuffleAnswers(!shuffleAnswers)}
                    />
                    <Text style={styles.optionText}>Shuffle Answers - Randomizes the answer choices within each question.</Text>
                </View>
                <View style={styles.option}>
                    <Checkbox
                        disabled={true}
                        status={repeatOnFailure ? 'checked' : 'unchecked'}
                        onPress={() => setRepeatOnFailure(!repeatOnFailure)}
                    />
                    <Text style={styles.optionText}>Repeat on Failure - Allows retries if the quiz is not passed.</Text>
                </View>
                <View style={styles.option}>
                    <Checkbox
                        disabled={!repeatOnlyFailedQuestionsPossible}
                        status={repeatOnlyFailedQuestions ? 'checked' : 'unchecked'}
                        onPress={() => setRepeatOnlyFailedQuestions(!repeatOnlyFailedQuestions)}
                    />
                    <Text style={styles.optionText}>Repeat Only Failed Questions - Retry only the questions you answered incorrectly.</Text>
                </View>
            </GenericModal.Body>
            <GenericModal.Footer>
                <Button
                    mode="outlined"
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                    labelStyle={{ color: '#7912b0' }}
                >
                    Cancel
                </Button>
                <Button
                    mode="contained"
                    onPress={handleQuizStart}
                    style={[styles.button, styles.submitButton]}
                    labelStyle={{ color: 'white' }}
                >
                    Start Quiz
                </Button>
            </GenericModal.Footer>
        </GenericModal>
    );
};

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    optionText: {
        marginLeft: 8,
        fontSize: 14,
        flexShrink: 1,
    },
    button: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    cancelButton: {
        borderColor: '#7912b0',
    },
    submitButton: {
        backgroundColor: '#7912b0',
    },
});

export default StartQuizModal;

import {SingleChoiceQuestion} from "../solving/Question";
import {ScrollView, StyleSheet, TextInput, View} from "react-native";
import {IconButton, RadioButton} from "react-native-paper";
import React from "react";

interface EditableSingleChoiceContentProps {
    editableQuestion: SingleChoiceQuestion;
    setEditableQuestion: any;
}

export const EditableSingleChoiceContent = ({
                                                editableQuestion,
                                                setEditableQuestion
                                            }: EditableSingleChoiceContentProps) => {
    const handleChoiceChange = (index: number, value: string) => {
        const choices = [...(editableQuestion).choices];
        choices[index] = value;
        setEditableQuestion({...editableQuestion, choices});
    };

    const handleAnswerToggle = (index: number) => {
        setEditableQuestion({...editableQuestion, answer: index});
    };

    const handleFeedbackChange = (index: number, value: string) => {
        const feedback = [...(editableQuestion).feedback];
        feedback[index] = value;
        setEditableQuestion({...editableQuestion, feedback});
    };

    const {choices, answer, feedback} = editableQuestion;
    return (
        <ScrollView style={styles.choicesContainer}>
            {choices.map((choice, index) => (
                <View key={index} style={styles.choiceContainer}>
                    <RadioButton
                        value={index.toString()}
                        status={answer === index ? 'checked' : 'unchecked'}
                        onPress={() => handleAnswerToggle(index)}
                    />
                    <View style={styles.answerContainer}>
                        <TextInput
                            style={styles.choiceText}
                            value={choice}
                            onChangeText={(value) => handleChoiceChange(index, value)}
                            placeholder="Enter choice"
                        />
                        <TextInput
                            style={styles.feedbackText}
                            value={feedback[index]}
                            onChangeText={(value) => handleFeedbackChange(index, value)}
                            placeholder="Feedback (optional)"
                        />
                    </View>
                    <IconButton icon={'delete'} onPress={() => {
                        // delete choice with given index
                        const choices = [...editableQuestion.choices];
                        choices.splice(index, 1);
                        const answer = editableQuestion.answer === index ? 0 : (editableQuestion.answer > index ? editableQuestion.answer - 1 : editableQuestion.answer)
                        const feedback = [...editableQuestion.feedback];
                        feedback.splice(index, 1);
                        setEditableQuestion({...editableQuestion, choices, answer, feedback});
                    }}/>
                </View>
            ))}
            {<View key={"new-one"}><IconButton icon={'plus'} style={{marginLeft: 2}} onPress={() => {
                const choices = [...editableQuestion.choices];
                choices.push("");
                const feedback = [...editableQuestion.feedback];
                feedback.push("");
                setEditableQuestion({...editableQuestion, choices, feedback});
            }}/></View>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    answerContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    choicesContainer: {
        marginTop: 8,
        padding: 8,
    },
    choiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        padding: 4,
    },
    choiceText: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    feedbackText: {
        fontSize: 12,
        marginLeft: 8,
        color: '#666',
        flex: 1,
    },
});
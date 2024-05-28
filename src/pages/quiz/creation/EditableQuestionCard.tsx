import {View, StyleSheet, TextInput, ScrollView} from "react-native";
import {Checkbox, IconButton} from "react-native-paper";
import React, {useState} from "react";
import {Question, MultipleChoiceQuestion} from "../solving/Question";


interface EditableMultipleChoiceContentProps {
    editableQuestion: MultipleChoiceQuestion;
    setEditableQuestion: any;

}

const EditableMultipleChoiceContent = ({editableQuestion, setEditableQuestion}: EditableMultipleChoiceContentProps) => {
    const handleChoiceChange = (index: number, value: string) => {
        const choices = [...(editableQuestion as MultipleChoiceQuestion).choices];
        choices[index] = value;
        setEditableQuestion({...editableQuestion, choices});
    };

    const handleAnswerToggle = (index: number) => {
        const answer = [...(editableQuestion as MultipleChoiceQuestion).answer];
        answer[index] = !answer[index];
        setEditableQuestion({...editableQuestion, answer});
    };

    const handleFeedbackChange = (index: number, value: string) => {
        const feedback = [...(editableQuestion as MultipleChoiceQuestion).feedback];
        feedback[index] = value;
        setEditableQuestion({...editableQuestion, feedback});
    };
    const {choices, answer, feedback} = editableQuestion as MultipleChoiceQuestion;
    return (
        <ScrollView style={styles.choicesContainer}>
            {choices.map((choice, index) => (
                <View key={index} style={styles.choiceContainer}>
                    <Checkbox
                        status={answer[index] ? 'checked' : 'unchecked'}
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
                        const answer = [...editableQuestion.answer];
                        answer.splice(index, 1);
                        const feedback = [...editableQuestion.feedback];
                        feedback.splice(index, 1);
                        setEditableQuestion({...editableQuestion, choices, answer, feedback});
                    }}/>
                </View>
            ))}
            {<View key={"new-one"}><IconButton icon={'plus'} style={{marginLeft: 2}} onPress={() => {
                const choices = [...editableQuestion.choices];
                choices.push("");
                const answer = [...editableQuestion.answer];
                answer.push(false);
                const feedback = [...editableQuestion.feedback];
                feedback.push("");
                setEditableQuestion({...editableQuestion, choices, answer, feedback});
            }}/></View>}
        </ScrollView>
    );
};

interface EditableQuestionCardProps {
    question: Question;
    isExpanded: boolean;
    toggleExpand: () => void;
}

export const EditableQuestionCard = ({
                                         question,
                                         isExpanded,
                                         toggleExpand
                                     }: EditableQuestionCardProps) => {
    const [editableQuestion, setEditableQuestion] = useState<Question>(question);

    const renderEditableQuestionContent = () => {
        if (editableQuestion.type === "multiple-choice") {
            return (
                <EditableMultipleChoiceContent
                    editableQuestion={editableQuestion as MultipleChoiceQuestion}
                    setEditableQuestion={setEditableQuestion}
                />
            );
        }
        return null;
    };

    return (
        <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
                <TextInput
                    style={styles.questionText}
                    value={editableQuestion.question}
                    onChangeText={(value) => setEditableQuestion({...editableQuestion, question: value})}
                    placeholder="Enter your question"
                />
                <View style={styles.icon}>
                    <IconButton
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={26}
                        onPress={toggleExpand}
                    />
                </View>
            </View>
            {isExpanded && renderEditableQuestionContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
        elevation: 4,
    },
    questionHeader: {
        backgroundColor: '#ebddff',
        display: 'flex',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    answerContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    questionText: {
        fontSize: 16,
        flex: 1,
        padding: 6
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
    icon: {},
});

import {Text, View, StyleSheet, ScrollView} from "react-native";
import {Checkbox, Icon} from "react-native-paper";
import React from "react";
import {Question, MultipleChoiceQuestion} from "./quiz/creation/Question";

interface QuestionCardProps {
    question: Question;
    isExpanded: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export const QuestionCard = ({question, isExpanded, onEdit, onDelete}: QuestionCardProps) => {
    const renderChoices = () => {
        if (question.type !== "multiple-choice") return null;
        const {choices, answer, feedback} = question as MultipleChoiceQuestion;
        return (
            <ScrollView style={styles.choicesContainer}>
                {choices.map((choice, index) => (
                    <View key={index} style={styles.choiceContainer}>
                        <Checkbox
                            status={answer[index] ? 'checked' : 'unchecked'}
                            disabled
                        />
                        <View style={styles.answerContainer}>
                            <Text style={styles.choiceText}>{choice}</Text>
                            {feedback[index] && <Text style={styles.feedbackText}>{feedback[index]}</Text>}
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
                <Text style={styles.questionText}>{question.question}</Text>
                <View style={styles.icon}>
                    <Icon
                        source={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={26}
                        color={'#000'}
                    />
                </View>
            </View>
            {isExpanded && renderChoices()}
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
    },
    questionText: {
        fontSize: 16,
        marginRight: 96,
        fontWeight: 'bold',
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
    },
    feedbackText: {
        fontSize: 12,
        marginLeft: 8,
        color: '#666',
    },
    icon: {},
});

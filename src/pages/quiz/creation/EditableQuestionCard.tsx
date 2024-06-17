import {View, StyleSheet, TextInput} from "react-native";
import {IconButton} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {Question, MultipleChoiceQuestion, SingleChoiceQuestion} from "../solving/Question";
import {EditableMultipleChoiceContent} from "./EditableMultipleChoiceContent";
import {EditableSingleChoiceContent} from "./EditableSingleChoiceContent";

interface EditableQuestionCardProps {
    editableQuestion: Question;
    isExpanded: boolean;
    toggleExpand: () => void;
    setEditableQuestion: (question: Question) => void;
}

export const EditableQuestionCard = ({
                                         editableQuestion,
                                         isExpanded,
                                         toggleExpand,
                                         setEditableQuestion
                                     }: EditableQuestionCardProps) => {

    const renderEditableQuestionContent = () => {
        if (editableQuestion.type === "multiple-choice") {
            return (
                <EditableMultipleChoiceContent
                    editableQuestion={editableQuestion as MultipleChoiceQuestion}
                    setEditableQuestion={setEditableQuestion}
                />
            );
        } else if (editableQuestion.type === "single-choice") {
            return (
                <EditableSingleChoiceContent
                    editableQuestion={editableQuestion as SingleChoiceQuestion}
                    setEditableQuestion={setEditableQuestion}
                />
            )
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
    questionText: {
        fontSize: 16,
        flex: 1,
        padding: 6
    },
    icon: {}
});

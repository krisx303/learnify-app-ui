import React from "react";
import {StyleSheet, View} from "react-native";
import MultipleChoiceQuestionView from "./MultipleChoiceQuestionView";
import {Question} from "Question";

interface QuestionsHolderProps {
    question: Question;
    userAnswer: any;
    setUserAnswer: (answers: any) => void;
    answer: any;
    isEditable: boolean;
}

const QuestionsHolder: React.FC<QuestionsHolderProps> = ({
                                                             question,
                                                             userAnswer,
                                                             setUserAnswer,
                                                             answer,
                                                             isEditable,
                                                         }) => {
    return (
        <View style={styles.container}>
            {question.type === "multiple-choice" && (
                <MultipleChoiceQuestionView
                    userAnswer={userAnswer}
                    setUserAnswer={setUserAnswer}
                    question={question}
                    isEditable={isEditable}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        backgroundColor: '#390854'
    },
});

export default QuestionsHolder;

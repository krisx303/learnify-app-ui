import React from "react";
import {StyleSheet, View} from "react-native";
import MultipleChoiceQuestionView from "./MultipleChoiceQuestionView";
import {Question} from "./Question";
import SingleChoiceQuestionView from "./SingleChoiceQuestionView";

interface QuestionsHolderProps {
    question: Question;
    userAnswer: any;
    setUserAnswer: (answers: any) => void;
    isEditable: boolean;
}

const QuestionsHolder: React.FC<QuestionsHolderProps> = ({
                                                             question,
                                                             userAnswer,
                                                             setUserAnswer,
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
            {question.type === "single-choice" && (
                <SingleChoiceQuestionView
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
    },
});

export default QuestionsHolder;

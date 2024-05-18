import React, {useEffect, useState} from "react";
import {Button, Text} from "@rneui/themed";
import {StyleSheet, View} from "react-native";
import QuestionsHolder from "./QuestionsHolder";
import {Question} from "Question";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {QuizDetails} from "../summmary/QuizDetails";
import TopBar from "../../main/TopBar";

interface QuestionsHolderParamList {
    QuestionsHolderScreenProps: { questions: Question[]; quizId: string, quiz: QuizDetails };
}

type QuestionsHolderScreenProps = RouteProp<QuestionsHolderParamList, 'QuestionsHolderScreen'>;

/** Provides a base version of user answer (for example for multiple choice question sets all options for not-chosen) */
const getBaseUserAnswer = (q: Question): any => {
    switch (q.type) {
        case "multiple-choice":
            return Array(q.choices?.length || 0).fill(false);
    }
    return {};
};

const QuestionsHolderScreen: React.FC<QuestionsHolderScreenProps> = () => {
    const route = useRoute<QuestionsHolderScreenProps>();
    const {questions, quiz} = route.params;
    const [index, setIndex] = useState<number>(0);
    const [question, setQuestion] = useState<Question>(questions[0]);
    const [userAnswer, setUserAnswer] = useState<any>(getBaseUserAnswer(question));
    const [isEditable, setEditable] = useState<boolean>(true);
    const navigation = useNavigation();

    const handleNext = () => {
        if (!isEditable) {
            if (index < questions.length - 1) {
                setIndex(index + 1);
            } else {
                navigation.navigate('QuizPage', {quizId: quiz.id, workspaceId: 'semestr1'});
            }
        }
        setEditable(!isEditable)
    };

    useEffect(() => {
        const q = questions[index];
        setQuestion(q)
        setUserAnswer(getBaseUserAnswer(q))
    }, [index])

    const getButtonTitle = (): string => {
        if (isEditable) return "Submit";
        return index < questions.length - 1 ? "Next" : "End";
    };

    return (
        <View style={styles.container2}>
            <TopBar/>
            <View style={styles.container}>
                <Text h4 style={styles.questionText}>
                    {question.question}
                </Text>
                <QuestionsHolder
                    question={question}
                    userAnswer={userAnswer}
                    setUserAnswer={setUserAnswer}
                    answer={question.answer}
                    isEditable={isEditable}
                />
                <View style={styles.buttonContainer}>
                    <Button title={getButtonTitle()} onPress={handleNext}/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: '#390854'
    },
    questionText: {
        marginTop: 20,
        textAlign: "center",
        color: "white"
    },
    buttonContainer: {
        alignSelf: "center",
    },
    container2: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%'
    },
});

export default QuestionsHolderScreen;

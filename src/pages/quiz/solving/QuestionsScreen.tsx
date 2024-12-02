import React, {useEffect, useState} from "react";
import {Button, StyleSheet, View} from "react-native";
import QuestionsHolder from "./QuestionsHolder";
import {Question} from "./Question";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../../../App";
import {StackNavigationProp} from "@react-navigation/stack";
import {useHttpClient} from "../../../transport/HttpClient";
import {ModularTopBar, UserDetailsWithMenu} from "../../../components/topbar";

type NavigationProps = StackNavigationProp<RootStackParamList, 'QuestionsScreen'>;
type RouteProps = RouteProp<RootStackParamList, 'QuestionsScreen'>;

/** Provides a base version of user answer (for example for multiple choice question sets all options for not-chosen) */
const getBaseUserAnswer = (q: Question): any => {
    switch (q.type) {
        case "multiple-choice":
            return Array(q.choices?.length || 0).fill(false);
        case "single-choice":
            return 0;
    }
    return {};
};

const QuestionsScreen: React.FC = () => {
    const httpClient = useHttpClient();
    const route = useRoute<RouteProps>();
    const {questions, quiz, previouslyCorrect} = route.params;
    const [index, setIndex] = useState<number>(0);
    const [question, setQuestion] = useState<Question>(questions[0]);
    const [userAnswer, setUserAnswer] = useState<any>(getBaseUserAnswer(question));
    const [isEditable, setEditable] = useState<boolean>(true);
    const navigation = useNavigation<NavigationProps>();
    const [correctness, setCorrectness] = useState<boolean[]>([]);

    const handleNext = () => {
        if (!isEditable) {
            if (index < questions.length - 1) {
                setIndex(index + 1);
            } else {
                updateResultsAndNavigate();
            }
        }else{
            addNewResult();
        }
        setEditable(!isEditable)
    };

    const addNewResult = () => {
        if (JSON.stringify(userAnswer)==JSON.stringify(question.answer)) {
            setCorrectness([...correctness, true])
        } else {
            setCorrectness([...correctness, false])
        }
    }

    const updateResultsAndNavigate = () => {
        const incorrectQuestions = questions.filter((_, index) => !correctness[index]).map(question => question.questionId);
        httpClient.updateQuizResult(quiz.id,
            previouslyCorrect + correctness.filter((answer) => answer).length,
            correctness.filter((answer) => !answer).length,
            incorrectQuestions)
            .then(() => navigation.navigate('QuizPage', {quizId: quiz.id, workspaceId: 'semestr1'}))
            .catch(console.error);
    }

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
            {/*TODO add here some title - likely description of what user does, f.e. quiz with question number*/}
            <ModularTopBar
                breadcrumbs={[
                    {text: "<Quiz name>"},
                    {text: "1/10"}
                ]}
                rightContent={<UserDetailsWithMenu displayUsername/>}
            />
            <View style={styles.container}>
                <h4 style={styles.questionText}>
                    {question.question}
                </h4>
                <QuestionsHolder
                    question={question}
                    userAnswer={userAnswer}
                    setUserAnswer={setUserAnswer}
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
        color: "white",
        fontSize: 30
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

export default QuestionsScreen;

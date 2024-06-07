import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import PieChart from "react-native-pie-chart";
import {Button, IconButton} from "react-native-paper";
import styles from './QuizPage.scss';
import TopBar from "../../main/TopBar";
import {Question} from "../solving/Question";
import {QuizDetails} from "./QuizDetails";
import {useHttpClient} from "../../../transport/HttpClient";
import {RootStackParamList} from "../../../../App";
import {StackNavigationProp} from "@react-navigation/stack";


type NavigationProps = StackNavigationProp<RootStackParamList, 'QuizPage'>;
type RouteProps = RouteProp<RootStackParamList, 'QuizPage'>;


const QuizPage: React.FC = () => {
    const [quiz, setQuizDetails] = useState<QuizDetails | undefined>();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const httpClient = useHttpClient();
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const {workspaceId, quizId} = route.params;

    useEffect(() => {
        httpClient.getQuizDetails(workspaceId, quizId)
            .then(onLoadedDetails)
            .catch(console.error);
    }, [httpClient, workspaceId, quizId]);

    useEffect(() => {
        httpClient.getQuizQuestions(quizId)
            .then(setQuestions)
            .catch(console.error);
    }, [httpClient, quiz]);

    useEffect(() => {
        if (quiz != undefined && questions.length > 0) {
            setLoading(false);
        }
    }, [quiz, questions]);

    const onLoadedDetails = (quizDetails: QuizDetails) => {
        setQuizDetails(quizDetails);
    }

    const asPercentage = (num: number) => {
        const percentage = (num / (quiz!!.numberOfExercises)) * 100;
        return parseFloat(percentage.toFixed(2));
    };

    const navigateToEditor = () => {
        navigation.navigate("QuizEditor", {quizId, workspaceId})
    };

    const QuizDetailsContent = ({quiz}: { quiz: QuizDetails }) => {
        const navigateToQuestionScreen = () => {
            navigation.navigate("QuestionsScreen", {
                quizId: quizId,
                questions: questions,
                quiz: quiz
            });
        };
        return (
            <View style={styles.container2}>
                <View style={styles.row}>
                    <Text style={styles.title}>{quiz.name}</Text>
                    <IconButton icon={"pencil"} size={30} iconColor="white" onPress={navigateToEditor}/>
                </View>
                <Text style={styles.description}>{quiz.description}</Text>
                <Text style={styles.info}>Number of questions: {quiz.numberOfExercises} </Text>
                <Text style={styles.subtitle}>Subtitle</Text>
                <View style={styles.chartContainer}>
                    <PieChart
                        widthAndHeight={250}
                        series={[quiz.lastScore.correct, quiz.lastScore.unanswered, quiz.lastScore.incorrect]}
                        sliceColor={["#109e16", "#1857b5", "#ff3c00"]}
                        coverRadius={0.5}
                        coverFill={"#FFF"}
                    />
                    <View style={styles.percentageContainer}>
                        <Text
                            style={[styles.percentageText, {color: "#109e16"}]}>Correct: {asPercentage(quiz.lastScore.correct)}%</Text>
                        <Text
                            style={[styles.percentageText, {color: "#1857b5"}]}>Unanswered: {asPercentage(quiz.lastScore.unanswered)}%</Text>
                        <Text
                            style={[styles.percentageText, {color: "#ff3c00"}]}>Incorrect: {asPercentage(quiz.lastScore.incorrect)}%</Text>
                    </View>
                </View>
                <Button style={styles.button} onPress={navigateToQuestionScreen}>
                    <Text style={styles.buttonText}>Start quiz</Text>
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar/>
            {loading ? (
                <ActivityIndicator size="small" color="#fff" style={styles.spinner}/>
            ) : quiz && quiz.id === undefined ? (
                <Text style={styles.error}>Error loading quiz details</Text>
            ) : (
                <QuizDetailsContent quiz={quiz!!}/>
            )}
        </View>
    );

};

export default QuizPage;
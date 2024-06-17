import {RouteProp, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, ImageBackground, Text, View} from "react-native";
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
        // httpClient.getQuizDetails(workspaceId, quizId)
        //     .then(onLoadedDetails)
        //     .catch(console.error);
        httpClient.getQuizQuestions(quizId)
            .then(setQuestions)
            .catch(console.error);
    }, [httpClient, workspaceId, quizId]);

    useEffect(() => {
        if (quiz != undefined) {
            setLoading(false);
        }
    }, [quiz, questions]);

    const onLoadedDetails = (quizDetails: QuizDetails) => {
        setQuizDetails(quizDetails);
    }

    useFocusEffect(
        React.useCallback(() => {
            httpClient.getQuizDetails(workspaceId, quizId)
                .then(onLoadedDetails)
                .catch(console.error);
        }, [httpClient.getQuizDetails])
    );

    const asPercentage = (num: number) => {
        const percentage = (num / (quiz!!.numberOfQuestions)) * 100;
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
                    <Text style={styles.title}>{quiz.title}</Text>
                    <IconButton icon={"pencil"} size={30} iconColor="white" onPress={navigateToEditor}/>
                </View>
                <Text style={styles.description}>{quiz.description}</Text>
                <Text style={styles.info}>Number of questions: {quiz.numberOfQuestions} </Text>
                <Text style={styles.info}>Best
                    result: {quiz.bestScore == null ? "0" : asPercentage(quiz.bestScore.correct)}% </Text>
                <Text style={styles.subtitle}>Last score</Text>
                {quiz.lastScore ? (
                    <View style={styles.chartContainer}>
                        <PieChart
                            widthAndHeight={250}
                            series={[quiz.lastScore.correct, quiz.lastScore.incorrect]}
                            sliceColor={["#109e16", "#ff3c00"]}
                            coverRadius={0.5}
                            coverFill={"#FFF"}
                        />
                        <View style={styles.percentageContainer}>
                            <Text
                                style={[styles.percentageText, {color: "#109e16"}]}>Correct: {asPercentage(quiz.lastScore.correct)}%</Text>
                            <Text
                                style={[styles.percentageText, {color: "#ff3c00"}]}>Incorrect: {asPercentage(quiz.lastScore.incorrect)}%</Text>
                        </View>
                    </View>
                ) : <Text style={styles.info}>No data available</Text>}
                <Button style={styles.button} onPress={navigateToQuestionScreen}>
                    <Text style={styles.buttonText}>Start quiz</Text>
                </Button>
            </View>
        );
    }

    return (
        <ImageBackground style={{flex: 1, width: "100%"}} source={require("../../../../assets/purple_background.png")}
                         imageStyle={{resizeMode: "cover"}}>
            <TopBar/>
            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.spinner}/>
            ) : quiz && quiz.id === undefined ? (
                <Text style={styles.error}>Error loading quiz details</Text>
            ) : (
                <QuizDetailsContent quiz={quiz!!}/>
            )}
        </ImageBackground>
    );

};

export default QuizPage;
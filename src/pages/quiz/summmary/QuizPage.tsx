import {RouteProp, useRoute} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, Text, View} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import PieChart from "react-native-pie-chart";
import {Button, Icon} from "react-native-paper";
import styles from './QuizPage.scss';
import TopBar from "../../main/TopBar";
import {Question} from "../creation/Question";
import {useHttpClient} from "../../../transport/HttpClient";
import {QuizInfo} from "./QuizInfo";
import TopBar from "./main/TopBar";
import {QuizDetails} from "./main/Types";
import {useHttpClient} from "../transport/HttpClient";

type RootStackParamList = {
    QuizPage: { workspaceId: string; quizId: string };
};


type QuizPageRouteProp = RouteProp<RootStackParamList, 'QuizPage'>;


const QuizPage: React.FC = () => {
    const [quiz, setQuizDetails] = useState<QuizDetails | undefined>();
    const [loading, setLoading] = useState(true);
    const httpClient = useHttpClient();

    const route = useRoute<QuizPageRouteProp>();
    const {workspaceId, quizId} = route.params;

    useEffect(() => {
        httpClient.getQuizDetails(workspaceId, quizId)
            .then(onLoadedDetails)
            .catch(console.error);
    }, [httpClient, workspaceId, quizId])

    const onLoadedDetails = (quizDetails: QuizDetails) => {
        setQuizDetails(quizDetails);
        setLoading(false);
    const navigation = useNavigation();
    const user = {
        username: 'JohnDoe',
        avatarUrl: 'https://cdn2.iconfinder.com/data/icons/people-round-icons/128/man_avatar-512.png',
    };
    const quiz: QuizInfo = {
        id: "agh_sieci_komputerowe_lab_1",
        name: "Sieci komputerowe - lab 1",
        description: "Warstwy modelu OSI/ISO",
        numberOfExercises: 20,
        lastScore: {
            incorrect: 6,
            correct: 12,
            unanswered: 2,
        }
    }
    const httpClient = useHttpClient();
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        httpClient.getQuizQuestions(quiz.id)
            .then(setQuestions)
            .catch(console.error);
    }, [httpClient]);

    const asPercentage = (num: number) => {
        const percentage = (num / (quiz.numberOfExercises)) * 100;
        return parseFloat(percentage.toFixed(2));
    };

    const QuizDetailsContent = ({quiz}: { quiz: QuizDetails }) => {
        return (
            <View style={styles.container2}>
                <Text style={styles.title}>{quiz.name}</Text>
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
                <Button
                    style={styles.button}
                    radius={"sm"}
                    type="solid"
                    onPress={() =>
                        navigation.navigate("QuestionsScreen", {
                            quizId: quiz.id,
                            questions: questions,
                            quiz: quiz
                        })
                    }
                >
                    <Text style={styles.buttonText}>
                        Start quiz
                    </Text>
                    <Icon name="arrow-forward" color="white"/>
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopBar />
            {loading ? (
                <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            ) : quiz && quiz.id === undefined ? (
                <Text style={styles.error}>Error loading quiz details</Text>
            ) : (
                <QuizDetailsContent quiz={quiz!!} />
            )}
        </View>
    );

};

export default QuizPage;